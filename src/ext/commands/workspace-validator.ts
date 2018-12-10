import { workspace } from 'vscode';
import { Globals } from '../../globals';

export class WorkspaceValidator {
    public static getInstance(): WorkspaceValidator {
        if (!this.instance) {
            this.instance = new WorkspaceValidator();
        }
        return this.instance;
    }

    private static instance: WorkspaceValidator;

    private constructor() { }
    public validate(): void {
        Globals.logger.info(`Validating workspace`);
        if (!this.isInWorkspace()) {
            const message = 'Format Files requires an active workspace, please open a workspace and try again';
            Globals.logger.error(message, true);
        }
        Globals.logger.info(`Workspace is valid!`);
    }

    private isInWorkspace(): boolean {
        return !!workspace.workspaceFolders;
    }
}
