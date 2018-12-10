import { InputBox, QuickInputButtons, window } from 'vscode';
import { Globals } from '../../globals';

export class RequestGlob {
    public static async execute(): Promise<string> {
        const glob = await this.getInstance().requestForGlob();
        this.getInstance().shouldAbort(glob);
        await this.getInstance().confirmGlob(glob);
        return glob;
    }

    private static instance: RequestGlob;

    private static getInstance(): RequestGlob {
        if (!this.instance) {
            this.instance = new RequestGlob();
        }
        return this.instance;
    }

    private constructor() { }

    private async requestForGlob(): Promise<string> {
        return await window.showInputBox({
            ignoreFocusOut: true,
            placeHolder: 'Enter glob pattern',
            prompt: 'Format Files matching glob pattern - press esc to cancel',
        });
    }

    private shouldAbort(glob: string): void {
        if (glob === undefined) {
            Globals.logger.error('Operation Aborted', true);
        } else if (!glob.trim()) {
            Globals.logger.error('Operation Aborted: Glob pattern empty', true);
        }
    }

    private async confirmGlob(glob: string): Promise<void> {
        const result = await window.showQuickPick(['Yes', 'No'], {
            ignoreFocusOut: true,
            placeHolder: `You entered '${glob}', is that correct?`,
        });

        if (result !== 'Yes') {
            Globals.logger.error('Operation Aborted', true);
        }
    }
}
