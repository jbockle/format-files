import { commands, ExtensionContext, Uri } from 'vscode';
import { Constants } from './constants';
import { Logger } from './ext/utilities/logger';
import prompts from './ext/prompts';
import { GetFiles } from './ext/queries/get-files';
import { formatFiles } from './ext/commands/format-files';
import { validateInWorkspace } from './ext/commands/validate-in-workspace';
import { Config } from './ext/utilities/config';

const logger = new Logger('ext');

export function activate(context: ExtensionContext): void {
  logger.info('activating');

  registerCommand(
    context,
    Constants.formatFiles,
    formatFilesInWorkspace);
  registerCommand(
    context,
    Constants.formatFilesFolder,
    formatFilesInWorkspace);
  registerCommand(
    context,
    Constants.formatFilesFromGlob,
    fromGlob);

  logger.info('activated');
}

export function deactivate(): void {
  logger.info('Format Files deactivated');
}

function registerCommand(context: ExtensionContext, command: string, callback: any): void {
  logger.info(`registering command ${command}`);
  context.subscriptions
    .push(commands.registerCommand(command, callback));
}

async function formatFilesInWorkspace(inFolder?: Uri): Promise<void> {
  try {
    openOutputChannel();
    logger.info(`Starting Format Files - Workspace ${inFolder ? 'Folder' : ''}`);
    Config.load();
    validateInWorkspace();
    const workspaceFolder = await prompts.selectWorkspaceFolder(inFolder);
    const files = await GetFiles.inWorkspace(workspaceFolder, inFolder);
    await prompts.confirmStart(`Format Files: Start formatting ${files.length} workspace files?`);
    await formatFiles(files);

    logger.info(`Format Files completed`);
  }
  catch (error) {
    logger.error(error);
  }
}

async function fromGlob(): Promise<void> {
  try {
    openOutputChannel();
    logger.info(`Starting Format Files - By Glob Pattern`);
    Config.load();
    validateInWorkspace();
    const workspaceFolder = await prompts.selectWorkspaceFolder();
    const glob = await prompts.requestGlob();
    const useDefaultExcludes = await prompts.useDefaultExcludes();
    const files = await GetFiles.inWorkspaceWithGlob(workspaceFolder, glob, useDefaultExcludes);
    await prompts.confirmStart(`Format Files: Start formatting ${files.length} workspace files using glob '${glob}'?`);
    await formatFiles(files);

    logger.info(`Format Files completed`);
  }
  catch (error) {
    logger.error(error);
  }
}

function openOutputChannel(): void {
  Logger.outputChannel.show(true);
  Logger.outputChannel.appendLine('');
  Logger.outputChannel.appendLine(''.padStart(50, ':'));
}