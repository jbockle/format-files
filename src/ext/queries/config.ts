import { workspace, WorkspaceConfiguration } from 'vscode';

export class Config {
    private get configuration(): WorkspaceConfiguration {
        return workspace.getConfiguration();
    }

    public get extensionsToInclude(): string {
        const extensions = this.configuration.get<string>('formatFiles.extensionsToInclude');
        return extensions === '*' ? extensions : `{${extensions}}`;
    }

    public get excludePattern(): (string) {
        return this.configuration.get<string>('formatFiles.excludePattern');
    }

    public get inheritWorkspaceExcludedFiles(): boolean {
        return this.configuration.get<boolean>('formatFiles.inheritWorkspaceExcludedFiles');
    }

    public get useGitIgnores(): boolean {
        return this.configuration.get<boolean>('formatFiles.useGitIgnores');
    }

    public get workspaceExcludes(): string[] {
        const excludes = this.configuration.get<{ [key: string]: boolean }>('files.exclude');
        return Object.keys(excludes)
            .filter((glob) => excludes[glob])
            .map((glob) => glob);
    }
}
