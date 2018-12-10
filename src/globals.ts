import { WorkspaceValidator } from './ext/commands/workspace-validator';
import { Logger, LogLevel } from './logger';

export class Globals {
    public static logger = new Logger(LogLevel._info);
    public static workspaceValidator = WorkspaceValidator.getInstance();

    public static formatFiles = 'formatFiles.start.workspace';
    public static formatFilesFromGlob = 'formatFiles.start.fromGlob';

    public static skipExcludes = false;
}
