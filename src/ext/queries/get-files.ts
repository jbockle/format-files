import { Uri, workspace, WorkspaceFolder } from 'vscode';
import { Config } from '../utilities/config';
import { Logger } from '../utilities/logger';

export class GetFiles {
  private _config = Config.instance;
  private _logger: Logger;

  private constructor() {
    this._logger = new Logger('get-files');
  }

  public static async inWorkspace(workspaceFolder: WorkspaceFolder): Promise<Uri[]> {
    const getFiles = new GetFiles();
    const includeGlob = getFiles.getIncludeGlob();
    const excludeGlob = await getFiles.getExcludeGlob();

    return await getFiles.execute(workspaceFolder, includeGlob, excludeGlob);
  }

  public static async inWorkspaceWithGlob(workspaceFolder: WorkspaceFolder, includeGlob: string, defaultExcludes: boolean): Promise<Uri[]> {
    const files = new GetFiles();
    const excludeGlob = defaultExcludes ? await files.getExcludeGlob() : '';

    return await files.execute(workspaceFolder, includeGlob, excludeGlob);
  }

  private getIncludeGlob(): string {
    this._logger.info(`creating include glob`);
    const includes = this._config.extensionsToInclude
      .split(',')
      .map((inc) => '**/*.' + inc.trim());

    const glob = `{${includes.join(',')}}`;
    this._logger.info(`\t${glob}`);
    return glob;
  }

  private async getExcludeGlob(): Promise<string> {
    this._logger.info(`creating exclude glob`);
    const exclusions = this._config.excludePattern
      .split(',')
      .map((exc) => exc.trim());

    if (this._config.inheritWorkspaceExcludedFiles) {
      this._logger.info(`\t\tincluding files.exclude globs`);
      this._config.workspaceExcludes.forEach((exc) => exclusions.push(exc));
    }

    const glob = `{${exclusions.filter((exc) => !!exc).join(',')}}`;
    this._logger.info(`\t\t\t${glob}`);
    return glob;
  }

  private async execute(workspaceFolder: WorkspaceFolder, includeGlob: string, excludeGlob: string): Promise<Uri[]> {
    this._logger.info(`searching for files in workspace folder '${workspaceFolder.name}' include:${includeGlob} exclude:${excludeGlob}`);
    let files = await workspace.findFiles(includeGlob, excludeGlob);

    files = files
      .filter(file => {
        return file.path.startsWith(workspaceFolder.uri.path);
      });

    this._logger.info(`Discovered ${files.length} files to format`);

    files.forEach(file => this._logger.info(`\t${file.fsPath}`));

    return files;
  }
}
