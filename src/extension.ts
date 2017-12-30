'use strict';
import {
    commands,
    ExtensionContext,
    Progress,
    ProgressLocation,
    TextDocument,
    Uri,
    ViewColumn,
    window,
    workspace,
    StatusBarAlignment,
    ThemeColor
} from 'vscode';
import { isNullOrUndefined } from 'util';
import { FormatFilesHelper } from './formatFilesHelper';

let helper = new FormatFilesHelper();

export function activate(context: ExtensionContext) {
    context.subscriptions.push(commands.registerCommand('editor.action.formatFiles', beginFormatFiles));
    context.subscriptions.push(commands.registerCommand('editor.action.cancelFormatting', cancelFormatting));
}

// region cancellation
function createCancelStatusBarItem() {
    let statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
    statusBarItem.text = "Cancel Formatting";
    statusBarItem.command = 'editor.action.cancelFormatting';
    statusBarItem.color = new ThemeColor('statusBar.foreground');
    statusBarItem.show();
    return statusBarItem;
}

function disposeCancelStatusBarItem() {
    helper.cancelOption.hide();
    helper.cancelOption.dispose();
}

async function cancelFormatting() {
    helper.cancelled = true;
}
// endregion

// region process
async function beginFormatFiles(folder) {
    try {
        helper.initialize();
        let folders = workspace.workspaceFolders;
        if (!folders) {
            let message = 'Format Files can only be utilized if VS Code is opened on a workspace folder.';
            helper.log(message);
            window.showWarningMessage(message);
            return;
        }
        let include = helper.getInclude();
        if (isNullOrUndefined(folder)) {
            folder = { path: `**/*.${include}` };
        }
        else {
            let root = workspace.workspaceFolders[0];
            folder.path = folder.path.replace(root.uri.path + '/', '');
            folder.path += `/**/*.${include}`;
        }
        helper.cancelled = false;
        let files = await workspace.findFiles(folder.path, helper.getExcludePattern());
        let progressOptions = { location: ProgressLocation.Window, title: 'formating documents' };
        helper.cancelOption = createCancelStatusBarItem();
        window
            .withProgress(progressOptions, p => {
                return new Promise((resolve, reject) => {
                    formatFiles(files, 0, resolve, p);
                });
            })
            .then(endFormatFiles);

    }
    catch (error) {
        handleError(error);
    }
}

function endFormatFiles() {
    disposeCancelStatusBarItem();
    helper.log('Operation completed');
}

async function formatFiles(files: Uri[], index: number, resolve, progress: Progress<{ message?: string }>) {
    if (helper.cancelled) {
        window.showInformationMessage(`Format files operation cancelled. Processed ${index} files.`);
        return;
    }

    if (files.length <= index) {
        window.showInformationMessage(`Format files done. Processed ${files.length} files.`);
        resolve();
        return;
    }

    try {
        progress.report({ message: files[index].path });
        await formatFile(files[index]);
    }
    catch (error) {
        handleError(error);
    }
    finally {
        formatFiles(files, index + 1, resolve, progress);
    }
}

async function formatFile(file: Uri) {
    helper.log(`Opening: ${file.path}`);
    let doc: TextDocument;
    try {
        doc = await workspace.openTextDocument(file.path)
    }
    catch (error) {
        handleError(error);
        return;
    }
    helper.log(`Showing ${doc.fileName}`);
    await window.showTextDocument(doc, { preview: false, viewColumn: ViewColumn.One }).then(async () => {
        helper.log(`Formatting ${doc.fileName}`);
        await commands.executeCommand('editor.action.formatDocument');
        helper.log(`Saving ${doc.fileName}`);
        await doc.save();
        helper.log(`Closing ${doc.fileName}`);
        await commands.executeCommand('workbench.action.closeActiveEditor');
    });
}
// endregion

function handleError(error) {
    helper.log(`An error occurred: ${error.message}`);
    console.log(error);
}

export function deactivate() {
    helper.log('Format Files deactivated');
}