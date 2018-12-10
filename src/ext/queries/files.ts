import { Uri, window, workspace } from 'vscode';
import { Globals } from '../../globals';
import { Config } from './config';

export class Files {

    public get root(): string {
        return workspace.workspaceFolders[0].uri.path;
    }
    public static getInstance(): Files {
        if (!this.instance) {
            this.instance = new Files();
        }
        return this.instance;
    }

    private static instance: Files;

    public config = Config.getInstance();

    private constructor() { }

    public async shouldUseDefaultExcludes(): Promise<boolean> {
        const result = await window.showQuickPick([
            `Yes - Use 'formatFiles' settings in vscode`,
            `No - Don't use excludes`,
        ],
            { placeHolder: 'Use default excludes?', ignoreFocusOut: true });

        if (!result) {
            Globals.logger.error('Operation Aborted', true);
        }

        return result.startsWith('Yes');
    }

    public async getFiles(folder: Uri): Promise<Uri[]> {
        const includeGlob = await this.getIncludeGlob(folder);
        const excludeGlob = await this.getExcludeGlob();

        return await (this.findFiles(includeGlob, excludeGlob));
    }

    public async getFilesByGlob(glob: string, defaultExcludes: boolean): Promise<Uri[]> {
        const excludeGlob = defaultExcludes ? await this.getExcludeGlob() : '';

        return await (this.findFiles(glob, excludeGlob));
    }

    private async findFiles(includeGlob: string, excludeGlob: string): Promise<Uri[]> {
        const files = await workspace.findFiles(includeGlob, excludeGlob);
        Globals.logger.info(`Found ${files.length}`);
        files.forEach((file) => Globals.logger.info(`\t${file.path}`));

        return files;
    }

    private getIncludeGlob(folder?: Uri): string {
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
