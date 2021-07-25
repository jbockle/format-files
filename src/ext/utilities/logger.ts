import { window } from 'vscode';

export enum LogLevel {
  debug = 0,
  info,
  warn,
  error,
}

export class Logger {
  public static readonly outputChannel = window.createOutputChannel('Format Files');

  public static logLevel = LogLevel.info;

  public constructor(public source: string) { }

  public debug(message: string): void {
    Logger.callLog(LogLevel.debug, this.source, message);
  }

  public info(message: string): void {
    Logger.callLog(LogLevel.info, this.source, message);
  }

  public warn(message: string): void {
    Logger.callLog(LogLevel.warn, this.source, message);
  }

  public error(error: Error): void;
  public error(message: string): void;
  public error(errorOrMessage: string | Error): void {
    let message: string = errorOrMessage.toString();
    if (errorOrMessage instanceof Error) {
      message = `${errorOrMessage}::${errorOrMessage.message}`;
    }

    Logger.callLog(LogLevel.error, this.source, message);
  }

  private static callLog(level: LogLevel, source: string, message: string): void {
    if (level >= this.logLevel) {
      this.outputChannel.appendLine(`[${this.getTimestamp()} ${LogLevel[level].padEnd(5, '.')}] (${source}) ${message}`);
    }
  }

  private static getTimestamp(): string {
    return new Date().toTimeString().split(' ')[0];
  }
}
