import { EndOfLine, TextDocument, window } from 'vscode';
import openFile from './file';

export default async function getGitIgnoreGlobs(): Promise<string[]> {
    const gitignoreUri = await window.showOpenDialog({
        canSelectMany: false,
        filters: { 'git ignore': ['gitignore'] },
    });
    if (gitignoreUri) {
        const doc = await openFile(gitignoreUri[0].path);
        return parseGitIgnore(doc);
    }
    return [];
}

function getEndOfLineStyle(doc: TextDocument): string {
    let eol: string;
    switch (doc.eol) {
        case EndOfLine.CRLF:
            eol = '\r\n';
            break;
        case EndOfLine.LF:
            eol = '\n';
    }
    return eol;
}

function parseGitIgnore(doc: TextDocument): string[] {
    const eol: string = getEndOfLineStyle(doc);
    return doc.getText()
        .split(eol)
        .filter((line) => !!line && line[0] !== '#')
        // '!' in .gitignore and glob mean opposite things so we need to swap it.
        // Return pairt [ignoreFlag, pattern], we'll concatenate it later.
        .map((line) => line[0] === '!' ? ['', line.substring(1)] : ['!', line])
        // Filter out hidden files/directories (i.e. starting with a dot).
        .filter((patternPair) => {
            const pattern = patternPair[1];
            return pattern.indexOf('/.') === -1 && pattern.indexOf('.') !== 0;
        })
        // Patterns not starting with '/' are in fact "starting" with '**/'. Since that would
        // catch a lot of files, restrict it to directories we check.
        // Patterns starting with '/' are relative to the project directory and glob would
        // treat them as relative to the OS root directory so strip the slash then.
        .map((patternPair) => {
            const pattern = patternPair[1];
            if (pattern[0] !== '/') {
                return [patternPair[0], `**/${pattern}`];
            }
            return [patternPair[0], pattern.substring(1)];
        })
        // We don't know whether a pattern points to a directory or a file and we need files.
        // Therefore, include both `pattern` and `pattern/**` for every pattern in the array.
        .reduce((result, patternPair) => {
            const pattern = patternPair.join('');
            result.push(pattern);
            result.push(`${pattern}/**`);
            return result;
        }, []);
}
