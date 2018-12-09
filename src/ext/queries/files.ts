import { EndOfLine, GlobPattern, scm, Uri, window, workspace } from 'vscode';
import { Globals } from '../../globals';
import { Config } from './config';
import openFile from './file';
import getGitIgnoreGlobs from './git-ignore-globs';

export class Files {
    private config: Config = new Config();

    public get root(): string {
        return workspace.workspaceFolders[0].uri.path;
    }

    public async getFiles(folder: Uri): Promise<Uri[]> {
        const includeGlob = this.getIncludeGlob(folder);
        const excludeGlob = await this.getExcludeGlob();

        const files = await workspace.findFiles(includeGlob, excludeGlob);
        Globals.logger.info(`Found ${files.length}`);
        files.forEach((file) => Globals.logger.info(`\t${file.path}`));
        return files;
    }

    public async getFilesByGlob(glob: GlobPattern): Promise<Uri[]> {
        throw new Error('not implemented');
    }

    private getIncludeGlob(folder?: Uri): GlobPattern {
        Globals.logger.info(`creating include glob`);
        if (folder) {
            Globals.logger.info(`\t\tfolder specified: ${folder.path}`);
            const path = folder.path.replace(`${this.root}/`, '');
            return `${path}/**/*.${this.config.extensionsToInclude}`;
        }

        const glob = `**/*.${this.config.extensionsToInclude}`;
        Globals.logger.info(`\t\t${glob}`);
        return glob;
    }

    private async getExcludeGlob(): Promise<string> {
        Globals.logger.info(`creating exclude glob`);
        const exclusions = this.config.excludePattern
            .split(',')
            .map((exc) => exc.trim());

        if (this.config.inheritWorkspaceExcludedFiles) {
            Globals.logger.info(`\t\tincluding files.exclude globs`);
            this.config.workspaceExcludes.forEach((exc) => exclusions.push(exc));
        }

        // if (this.config.useGitIgnores) {
        //     (await getGitIgnoreGlobs()).forEach((exc) => exclusions.push(exc));
        // }

        const glob = `{${exclusions.filter((exc) => !!exc).join(',')}}`;
        Globals.logger.info(`\t\t\t${glob}`);
        return glob;
    }
}
