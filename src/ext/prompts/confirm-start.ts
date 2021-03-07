import { window } from 'vscode';
import { OperationAborted } from '../errors/operation-aborted';
import { Logger } from '../utilities/logger';

const logger = new Logger('confirm-start');

export async function confirmStart(prompt: string): Promise<void> {
  const result = await window.showQuickPick([`Do it!`, `Nevermind`], {
    ignoreFocusOut: true,
    placeHolder: `${prompt} (check 'Format Files' output for list of files)`,
  });

  logger.info(`result: ${result}`);

  if (!result || result === 'Nevermind') {
    throw new OperationAborted(result);
  }
}
