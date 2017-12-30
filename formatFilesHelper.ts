import {
    OutputChannel,
    StatusBarItem,
    WorkspaceConfiguration,
    workspace,
    window
} from "vscode";


export class FormatFilesHelper {
    output: OutputChannel
    cancelled: boolean
    cancelOption: StatusBarItem
    config: WorkspaceConfiguration

    constructor() {
        this.output = window.createOutputChannel('formatFiles');
        this.log('Format Files activated');
    }

    log(message: string): void {
        this.output.appendLine(message);
    }

    initialize() {
        this.config = workspace.getConfiguration('formatFiles');
    }

    getInclude(): string {
        let include: string = this.config.get('include');
        this.log(`Extensions to include: ${include}`)
        if (include !== '*') {
            include = `{${include}}`;
        }
        return include;
    }

    getExcludePattern(): string {
        let excludePattern: string = this.config.get('excludePattern');
        this.log(`Excluding ${excludePattern}`);
        return excludePattern;
    }
}