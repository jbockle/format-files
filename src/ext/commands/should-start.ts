import { window } from 'vscode';
import { Globals } from '../../globals';

export default async function shouldStartFormatting(length: number, prompt: string): Promise<void> {
    const result = await window.showQuickPick([`Do it!`, `Nevermind`], {
        ignoreFocusOut: true,
        placeHolder: `${prompt} (check 'Format Files' output for list of files)`,
    });

    if (!result || result === 'Nevermind') {
        Globals.logger.error(`Operation Aborted`, true);
    }
}
