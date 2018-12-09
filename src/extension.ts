import { commands, ExtensionContext, Uri } from 'vscode';
import { FormatFiles } from './ext/commands/format-files';
import queries from './ext/queries';
import { Globals } from './globals';

export function activate(context: ExtensionContext): void {
    Globals.logger.info('activating');

    registerCommand(
        context,
        Globals.formatFiles,
        formatFiles);

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
    Globals.logger.info(`Starting Format Files`);
    Globals.workspaceValidator.validate();

    const targetFiles = await queries.files.getFiles(folder);

    const formatFilesCommand = new FormatFiles();
    await formatFilesCommand.execute(targetFiles);
    Globals.logger.info(`Format Files completed`);
}
