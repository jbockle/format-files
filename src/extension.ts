'use strict';
import { window, workspace, ViewColumn, commands, ExtensionContext, ProgressLocation, Uri, Progress } from 'vscode';

let output = window.createOutputChannel('formatAllWorkspaceFiles');

export function activate(context: ExtensionContext) {
    let disposable = commands.registerCommand('editor.action.formatAllWorkspaceFiles', async () => {
        try {
            let files = await workspace.findFiles('**/*', '**/node_modules/**');
            let progressOptions = { location: ProgressLocation.Window, title: 'formating documents' };
            window.withProgress(progressOptions, p => {
                return new Promise((resolve, reject) => {
                    format(files, 0, resolve, p);
                });
            });
        }
        catch (error) {
            handleError(error);
        }
    });

    context.subscriptions.push(disposable);
}
async function format(files: Uri[], index: number, resolve, progress: Progress<{ message?: string }>) {
    try {
        if (files.length <= index) {
            window.showInformationMessage(`Format all files done. ${files.length} files processed.`);
            resolve();
            return;
        }
        progress.report({ message: files[index].path });
        output.appendLine(`Opening: ${files[index].path}`);
        let doc = await workspace.openTextDocument(files[index].path)
        output.appendLine(`Showing ${doc.fileName}`);
        await window.showTextDocument(doc, { preview: false, viewColumn: ViewColumn.One }).then(async () => {
            output.appendLine(`Formatting ${doc.fileName}`);
            await commands.executeCommand('editor.action.formatDocument');
            output.appendLine(`Saving ${doc.fileName}`);
            await doc.save();
            output.appendLine(`Closing ${doc.fileName}`);
            await commands.executeCommand('workbench.action.closeActiveEditor');
            format(files, index + 1, resolve, progress);
        });
    }
    catch (error) {
        handleError(error);
    }
}
function handleError(error) {
    output.appendLine(`An error occurred: ${error.message}`);
}
// this method is called when your extension is deactivated
export function deactivate() {
}