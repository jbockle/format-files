import { OutputChannel, window } from 'vscode';

export enum LogLevel {
    _info = 1,
    _warn,
    error,
}

export class Logger {
    public level: LogLevel;
    public output: OutputChannel;
    constructor(level: LogLevel) {
        this.level = level;
        this.output = window.createOutputChannel('Format Files');
        this.info('test');
        this.warn('test');
        this.error('test');
    }

    public info(message: string): void {
        callLog(LogLevel._info, message, this);
    }

    public warn(message: string): void {
        callLog(LogLevel._warn, message, this);
    }

    public error(message: string, raiseException: boolean = false): void {
        callLog(LogLevel.error, message, this);
        if (raiseException) {
            throw new Error(message);
        }
    }
}

function getLevelPrefix(level: LogLevel): string {
    const levelName: string = LogLevel[level];
    const timestamp = getTimestamp();
    return `[${levelName}:${timestamp}]`;
}

function callLog(level: LogLevel, message: string, logger: Logger): void {
    if (shouldLog(level, logger.level)) {
        const prefix = getLevelPrefix(level);
        logger.output.appendLine(`${prefix} ${message}`);
    }
}

function shouldLog(targetlevel: LogLevel, level: LogLevel): boolean {
    return targetlevel.valueOf() >= level.valueOf();
}

function getTimestamp(): string {
    return new Date().toTimeString().split(' ')[0];
}
