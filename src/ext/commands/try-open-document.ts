import { TextDocument, workspace } from 'vscode';
import { Logger } from '../utilities/logger';

const logger = new Logger('try-open-document');

export async function tryOpenDocument(path: string): Promise<TextDocument | undefined> {
  try {
    logger.info(`opening ${path}`);
    return await workspace.openTextDocument(path);
  } catch (error) {
    logger.error(`\tUnable to open file ${path}: ${error.message}`);
  }
}
