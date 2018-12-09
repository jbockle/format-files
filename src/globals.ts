import { WorkspaceValidator } from './ext/commands/workspace-validator';
import { Logger, LogLevel } from './logger';

export class Globals {
    public static logger = new Logger(LogLevel._info);
    public static workspaceValidator = new WorkspaceValidator();
    public static formatFiles = 'formatFiles.start';
}
