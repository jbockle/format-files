import { Uri, WorkspaceFolder } from 'vscode';
import { fdir } from 'fdir';
import * as path from 'path';
import * as mm from 'micromatch';
import { Config } from '../utilities/config';
import { Logger } from '../utilities/logger';

type FilterFn = (path: string, isDirectory: boolean) => boolean;

type WithGlobOptions = {
  glob: string;
  useDefaultExcludes: boolean;
};

/**
 * use cases
 * 1. by workspace
 * 2. by folder in workspace
 * 3. by glob in workspace
 * 
 * exclusion use cases
 * - config exclusions
 * - git exclusions
 */
export class FileQueryApi {
  private _config = Config.instance;
  private _logger = new Logger('files-api');

  private constructor(
    public readonly workspaceFolder: WorkspaceFolder,
    public readonly folderOrGlob?: Uri | string,
  ) { }

  public useDefaultExcludes = true;

  public static async getWorkspaceFiles(workspaceFolder: WorkspaceFolder, inFolder?: Uri): Promise<Uri[]> {
    return new FileQueryApi(workspaceFolder, inFolder).execute();
  }

  public static async getWorkspaceFilesWithGlob(workspaceFolder: WorkspaceFolder, options: WithGlobOptions): Promise<Uri[]> {
    const api = new FileQueryApi(workspaceFolder, options.glob);
    api.useDefaultExcludes = options.useDefaultExcludes;
    return api.execute();
  }

  private isByGlob(folderOrGlob?: Uri | string): folderOrGlob is string {
    return !!this.folderOrGlob && typeof this.folderOrGlob === 'string';
  }

  private isByFolder(folderOrGlob?: Uri | string): folderOrGlob is Uri {
    return folderOrGlob instanceof Uri;
  }

  private getIncludeFilter(): FilterFn | undefined {
    this._logger.info('\tgetting include filter');

    if (this.isByGlob(this.folderOrGlob)) {
      const glob = this.folderOrGlob;
      this._logger.info(`\t\tfiltering by glob: ${this.folderOrGlob}`);

      return (file): boolean => {
        const pathAsRelative = path.relative(this.workspaceFolder.uri.fsPath, file);
        const matches = mm.isMatch(pathAsRelative, glob);
        this._logger.debug(`\t\t\tmatches glob:${matches}\t${pathAsRelative}`);

        return matches;
      };
    } else if (this._config.extensionsToInclude.length) {
      this._logger.info(`\tfiltering by extensions: ${this._config.extensionsToInclude.join(',')}`);
      const extensions = this._config.extensionsToInclude.map(ext => ext.startsWith('.') ? ext : '.' + ext);

      return (file): boolean => {
        const matches = extensions.some(e => file.endsWith(e));
        this._logger.debug(`\t\t\tmatches extension:${matches}\t${file}`);

        return matches;
      };
    }

    this._logger.warn(`\tno filters specified`);
  }

  private getExcludeFilter(): FilterFn | undefined {
    this._logger.info(`\tgetting exclude filter`);

    if (!this.useDefaultExcludes) {
      return;
    }

    const exclusions = this._config.excludePattern
      .split(',')
      .map(exclusion => exclusion.trim())
      .filter(exclusion => !!exclusion);

    if (this._config.inheritWorkspaceExcludedFiles) {
      this._logger.info(`\t\tincluding files.exclude globs: ${this._config.workspaceExcludes.join(',')}`);
      this._config.workspaceExcludes.forEach((exc) => exclusions.push(exc));
    }

    const exclusionsGlob = `{${exclusions.join(',')}}`;
    this._logger.info(`\t\texclusions glob: ${exclusionsGlob}`);

    return (file): boolean => {
      const pathAsRelative = path.relative(this.workspaceFolder.uri.fsPath, file);
      const ignored = mm.isMatch(pathAsRelative, exclusionsGlob);
      this._logger.debug(`\t\t\texcluded:${ignored}\t${pathAsRelative}`);

      return !ignored;
    };
  }

  private async execute(): Promise<Uri[]> {
    this._logger.info(`searching for files in workspace ${this.workspaceFolder.uri.fsPath}`);

    let builder = new fdir().withFullPaths();
    const includeFilter = this.getIncludeFilter();

    if (includeFilter) {
      builder = builder.filter(includeFilter);
    }

    const excludeFilter = this.getExcludeFilter();
    if (excludeFilter) {
      builder = builder.filter(excludeFilter);
    }

    if (this._config.excludedFolders.length) {
      const excludedFolders = this._config.excludedFolders.map(folder => path.resolve(this.workspaceFolder.uri.fsPath, folder));
      builder = builder.exclude((_directoryName, directoryPath) => {
        return excludedFolders.some(excludedFolder => {
          return directoryPath.startsWith(excludedFolder);
        });
      });
    }

    this.isByFolder(this.folderOrGlob) && this._logger.info(`\tfiltering by folder: ${this.folderOrGlob.fsPath}`);

    const searcher = this.isByFolder(this.folderOrGlob)
      ? builder.crawl(this.folderOrGlob.fsPath) // search for specified folder
      : builder.crawl(this.workspaceFolder.uri.fsPath); // search within workspace folder

    this._logger.info('\texecuting search');
    const output: any = await searcher.withPromise();

    if (Array.isArray(output)) {
      this._logger.info(`\tfound files: ${output.length}\r\n${output.join('\r\n')}`);
      return output.map(Uri.file);
    }

    this._logger.warn('did not find any files');

    return [];
  }
}