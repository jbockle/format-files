import { TextDocument, workspace } from 'vscode';
import { Globals } from '../../globals';

export default async function openFile(path: string): Promise<TextDocument> {
    try {
        return await workspace.openTextDocument(path);
    } catch (error) {
        Globals.logger.error(`Unable to open file ${path}: ${error.message}`);
    }
}
