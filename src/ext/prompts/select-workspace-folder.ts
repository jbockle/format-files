import { window, workspace, WorkspaceFolder } from 'vscode';
import { OperationAborted } from '../errors/operation-aborted';
import { Logger } from '../utilities/logger';

const logger = new Logger('select-workspace-folder');

export async function selectWorkspaceFolder(): Promise<WorkspaceFolder> {
  if (workspace.workspaceFolders) {
    if (workspace.workspaceFolders.length === 1) {
      const folder = workspace.workspaceFolders[0];
      logger.info(`a single workspace folder was found, selecting ${folder.name}`);
      return folder;
    } else if (workspace.workspaceFolders.length > 1) {
      return await requestWorkspaceFolder([...workspace.workspaceFolders]);
    }
  }

  throw new OperationAborted('a workspace folder was not found');
}

async function requestWorkspaceFolder(folders: WorkspaceFolder[]): Promise<WorkspaceFolder> {
  const result = await window.showQuickPick(folders.map(folder => folder.name), {
    ignoreFocusOut: true,
    placeHolder: 'Select workspace',
  });

  logger.info(`user selected workspace folder: ${result}`);

  if (!result) {
    throw new OperationAborted('User aborted');
  }

  return folders.find(folder => folder.name === result)!;
}