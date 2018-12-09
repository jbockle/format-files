import { workspace } from 'vscode';
import { Globals } from '../../globals';

export class WorkspaceValidator {
    public validate(): void {
        Globals.logger.info(`Validating workspace`);
        if (!isInWorkspace()) {
            const message = 'Format Files requires an active workspace, please open a workspace and try again';
            Globals.logger.error(message, true);
        }
        Globals.logger.info(`Workspace is valid!`);
    }
}

function isInWorkspace(): boolean {
    return !!workspace.workspaceFolders;
}
