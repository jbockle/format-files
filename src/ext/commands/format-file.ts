import { commands, Uri, ViewColumn, window } from 'vscode';
import { Globals } from '../../globals';
import openFile from '../queries/file';

export default async function formatFile(file: Uri): Promise<void> {
    Globals.logger.info(`formatting ${file.path}`);
    const doc = await openFile(file.path);
    if (doc) {
        await window.showTextDocument(doc, { preview: false, viewColumn: ViewColumn.One });
        await commands.executeCommand('editor.action.formatDocument');
        await commands.executeCommand('workbench.action.files.save');
        await commands.executeCommand('workbench.action.closeActiveEditor');
    }
}
