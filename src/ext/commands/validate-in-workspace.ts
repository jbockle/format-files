import { workspace } from 'vscode';
import { OperationAborted } from '../errors/operation-aborted';
import { Logger } from '../utilities/logger';

const logger = new Logger('validate-in-workspace');

export function validateInWorkspace(): void {
  logger.info(`found workspace folders: ${workspace.workspaceFolders?.map(folder => folder.name).join(', ')}`);

  if (workspace.workspaceFolders === undefined || workspace.workspaceFolders.length === 0) {
    throw new OperationAborted('Format Files requires an active workspace, please open a workspace and try again');
  }

  logger.info(`workspace is valid!`);
}
