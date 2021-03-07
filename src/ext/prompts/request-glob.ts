import { window } from 'vscode';
import { OperationAborted } from '../errors/operation-aborted';
import { Logger } from '../utilities/logger';

const logger = new Logger('request-glob');

export async function requestGlob(): Promise<string> {
  const maybeGlob = await window.showInputBox({
    ignoreFocusOut: true,
    placeHolder: 'Enter glob pattern',
    prompt: 'Format Files matching glob pattern - press esc to cancel',
  });

  logger.info(`glob entered: ${maybeGlob}`);

  if (!maybeGlob) {
    throw new OperationAborted('Glob pattern undefined or empty');
  }

  const confirmed = await confirmBlobInput(maybeGlob);
  if (!confirmed) {
    throw new OperationAborted('User aborted');
  }

  return maybeGlob;
}

async function confirmBlobInput(glob: string): Promise<boolean> {
  const result = await window.showQuickPick(['Yes', 'No'], {
    ignoreFocusOut: true,
    placeHolder: `You entered '${glob}', is that correct?`,
  });

  return result === 'Yes';
}
