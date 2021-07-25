import { workspace } from 'vscode';
import { Logger, LogLevel } from './logger';

interface FormatFilesConfig {
  extensionsToInclude: string;
  excludePattern?: string;
  inheritWorkspaceExcludedFiles?: boolean;
  runOrganizeImports?: boolean;
  useGitIgnore?: boolean;
  excludedFolders?: string[];
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

export class Config {
  private _excludeFiles: Record<string, boolean> = {};
  private _formatFilesConfig!: FormatFilesConfig;
  private _logger: Logger;

  private constructor() {
    this._logger = new Logger('config');
    this.loadConfigFromWorkspace();
  }

  public static readonly instance = new Config();

  private loadConfigFromWorkspace(): void {
    this._formatFilesConfig = workspace.getConfiguration().get<FormatFilesConfig>('formatFiles', { extensionsToInclude: '' });
    this._excludeFiles = workspace.getConfiguration().get<Record<string, boolean>>('files.exclude', {});
    Logger.logLevel = LogLevel[this._formatFilesConfig.logLevel ?? 'info'];
    this._logger.info(`config: ${JSON.stringify(this._formatFilesConfig)}`);
    this._logger.info(`excluded files: ${JSON.stringify(this._excludeFiles)}`);
  }

  public get excludedFolders(): string[] {
    if (Array.isArray(this._formatFilesConfig.excludedFolders)) {
      return this._formatFilesConfig.excludedFolders;
    }

    return [];
  }

  public get extensionsToInclude(): string[] {
    let targetExtensions = this._formatFilesConfig.extensionsToInclude;

    // for backwards compatibility, remove { & } if present
    targetExtensions = targetExtensions.replace(/\{|\}/g, '');

    return targetExtensions.split(',')
      .map(ext => ext.trim())
      .filter(ext => !!ext);
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

  public get useGitIgnore(): boolean {
    return this._formatFilesConfig.useGitIgnore ?? true;
  }

  public static load(): void {
    const config = Config.instance;
    config.loadConfigFromWorkspace();
  }
}
