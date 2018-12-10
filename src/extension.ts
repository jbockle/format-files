import { commands, ExtensionContext, Uri, window } from 'vscode';
import { FormatFiles } from './ext/commands/format-files';
import { RequestGlob } from './ext/commands/request-glob';
import shouldStartFormatting from './ext/commands/should-start';
import { Files } from './ext/queries/files';
import { Globals } from './globals';

export function activate(context: ExtensionContext): void {
    Globals.logger.info('activating');

    registerCommand(
        context,
        Globals.formatFiles,
        formatFiles);
    registerCommand(
        context,
        Globals.formatFilesFromGlob,
        fromGlob);

    Globals.logger.info('activated');
}

export function deactivate(): void {
    Globals.logger.info('Format Files deactivated');
}

function registerCommand(context: ExtensionContext, command: string, callback: any): void {
    Globals.logger.info(`registering command ${command}`);
    context.subscriptions
        .push(commands.registerCommand(command, callback));
}

async function formatFiles(folder?: Uri): Promise<void> {
    Globals.logger.info(`Starting Format Files - Workspace`);
    Globals.workspaceValidator.validate();

    const files = await Files.getInstance().getFiles(folder);

    await shouldStartFormatting(files.length,
        `Format Files: Start formatting ${files.length} workspace files?`);

    await FormatFiles.getInstance().execute(files);
    Globals.logger.info(`Format Files completed`);
}

async function fromGlob(): Promise<void> {
    Globals.logger.info(`Starting Format Files - By Glob Pattern`);
    Globals.workspaceValidator.validate();

    const glob = await RequestGlob.execute();
    const useDefaultExcludes = await Files.getInstance().shouldUseDefaultExcludes();

    const files = await Files.getInstance().getFilesByGlob(glob, useDefaultExcludes);

    await shouldStartFormatting(files.length,
        `Format Files: Start formatting ${files.length} workspace files using glob '${glob}'?`);

    await FormatFiles.getInstance().execute(files);
    Globals.logger.info(`Format Files completed`);
}
