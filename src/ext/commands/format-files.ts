import { ProgressLocation, Uri, window } from 'vscode';
import { Globals } from '../../globals';
import formatFile from './format-file';

export class FormatFiles {

    public async execute(files: Uri[]): Promise<void> {
        await window.withProgress(
            {
                cancellable: true,
                location: ProgressLocation.Notification,
                title: 'formatting documents',
            },
            async (progress, token) => {
                const incrementProgressBy = 1 / files.length;
                try {
                    for (let index = 0; index < files.length; index++) {
                        const file = files[index];
                        if (token.isCancellationRequested) {
                            this.showModal(`Format Files operation cancelled. Processed ${index} files.`);
                            break;
                        }
                        progress.report({ message: file.path, increment: incrementProgressBy });
                        await formatFile(file);
                    }
                    if (!token.isCancellationRequested) {
                        this.showModal(`Format Files completed. Processed ${files.length} files.`);
                    }
                } catch (error) {
                    Globals.logger.error(`An error occurred while running Format Files: ${error.message}`, true);
                }
            });
    }

    private async showModal(message: string): Promise<void> {
        Globals.logger.info(message);
        await window.showInformationMessage(message, { modal: true });
    }
}
