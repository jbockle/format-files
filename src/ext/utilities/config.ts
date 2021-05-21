import { workspace } from 'vscode';
import { Logger } from './logger';

interface FormatFilesConfig {
  extensionsToInclude?: string;
  excludePattern?: string;
  inheritWorkspaceExcludedFiles?: boolean;
  runOrganizeImports?: boolean;
}

export class Config {
  private _excludeFiles: Record<string, boolean>;
  private _formatFilesConfig: FormatFilesConfig;
  private _logger: Logger;

  private constructor() {
    this._logger = new Logger('config');
    this._excludeFiles = {};
    this._formatFilesConfig = {};
    this.loadConfigFromWorkspace();
  }

  public static readonly instance = new Config();

  private loadConfigFromWorkspace(): void {
    this._formatFilesConfig = workspace.getConfiguration().get<FormatFilesConfig>('formatFiles', {});
    this._excludeFiles = workspace.getConfiguration().get<Record<string, boolean>>('files.exclude', {});
    this._logger.info(`config: ${JSON.stringify(this._formatFilesConfig)}`);
    this._logger.info(`excluded files: ${JSON.stringify(this._excludeFiles)}`);
  }

  public get extensionsToInclude(): string {
    let targetExtensions = this._formatFilesConfig.extensionsToInclude || '*';

    // for backwards compatibility, remove { & } if present
    targetExtensions = targetExtensions.replace(/\{|\}/g, '');

    targetExtensions = targetExtensions.indexOf(',') === -1
      ? targetExtensions.trim()
      : `{${targetExtensions.split(',').map(ext => ext.trim()).join(`,`)}}`;

    return targetExtensions;
  }

  public get excludePattern(): string {
    return this._formatFilesConfig.excludePattern ?? '';
  }

  public get inheritWorkspaceExcludedFiles(): boolean {
    return this._formatFilesConfig.inheritWorkspaceExcludedFiles ?? false;
  }

  public get runOrganizeImports(): boolean {
    return this._formatFilesConfig.runOrganizeImports ?? false;
  }

  public get workspaceExcludes(): string[] {
    return Object.keys(this._excludeFiles)
      .filter(glob => this._excludeFiles[glob])
      .map(glob => glob);
  }

  public static load(): void {
    const config = Config.instance;
    config.loadConfigFromWorkspace();
  }
}
