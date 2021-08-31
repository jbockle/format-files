# Format Files

Format Files is a VS Code extension that formats all files in the current workspace, selected folder or glob.

<p>
  <a href="https://marketplace.visualstudio.com/items?itemName=jbockle.jbockle-format-files">
    <img alt="VS Code Marketplace Downloads" src="https://img.shields.io/visual-studio-marketplace/d/jbockle.jbockle-format-files"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=jbockle.jbockle-format-files">
    <img alt="VS Code Marketplace Installs" src="https://img.shields.io/visual-studio-marketplace/i/jbockle.jbockle-format-files"></a>
</p>

[Get Format Files on the Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=jbockle.jbockle-format-files)

> Note: Due to the limitations in VSCode API, this opens each file, runs formatting command, saves the file (other save actions are started as well, to support features such as `tslint.autoFixOnSave` on typescript files), then closes it. The time to complete depends on the number of files and how large the files are.

## Usage

- Open command pallette (Ctrl+Shift+P) & enter "Start Format Files: Workspace"
  - Uses default exclude options
  - Keybindable to 'formatFiles.start.workspaces' command
- Open command pallette (Ctrl+Shift+P) & enter "Start Format Files: From Glob"
  - Prompts for a user defined glob pattern
  - Prompts to use default exclude options or none
  - Keybindable to 'formatFiles.start.fromGlob' command
- Right click a folder and select "Start Format Files: This Folder"
  - Uses default exclude options

> This extension will prompt the user to confirm to start formatting. Check **_Format Files_** in the Output pane for the list of files that will be formatted. A progress bar will appear on bottom right to indicate the progress of the formatting.

### Options

These settings are specific to VS Code and need to be set in the VS Code settings file. See the [documentation](https://code.visualstudio.com/docs/getstarted/settings) for how to do that.

- `formatFiles.excludedFolders`: [ _default_: `[ "node_modules", ".vscode", ".git", "dist", ".chrome"]` ]
  list of folder names to exclude, relative to the workspace root
- `formatFiles.extensionsToInclude`: [ *default*: '\*' ]
  comma delimited list of extensions to include, i.e. "ts,js,cp,cs", if this is not specified all extensions are included
- `formatFiles.excludePattern`: [ *default*: unset]
  GlobPattern of paths to exclude.
- `formatFiles.inheritWorkspaceExcludedFiles`: [ *default*: `true` ]
  Specifies that workspace globs specified in `files.exclude` that are `true` will be included in exclude glob
- `formatFiles.runOrganizeImports`: [ *default*: `true` ]
  Additionally organize all imports when formatting files (Uses the built-in 'Organize Imports' command, which is supported by some languages)
- `formatFiles.useGitIgnore`: [ *default*: `true` ]
  If the workspace folder is a git repository, skips files that git ignores

## Requirements

Each extension needs a formatter installed for it to work, or else the VS Code formatter will display an error that it does not have a formatter for the given extension.

Some recommended formatters:

- [Beautify - Javascript, JSON, CSS, Sass, HTML](https://marketplace.visualstudio.com/items?itemName=HookyQR.beautify)
- [C# FixFormat - C#](https://marketplace.visualstudio.com/items?itemName=Leopotam.csharpfixformat)
- [Clang Format - C, C++, Java, JavaScript, Objective-C, Objective-C++, Protobuf](https://marketplace.visualstudio.com/items?itemName=xaver.clang-format)
- [Prettier - Javascript,TypeScript,CSS](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [EditorConfig - \*\*\*](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

## Known Issues

- If your code actions on save are not run on some of your files, it may be due to VS Code's `editor.codeActionsOnSaveTimeout` setting. If a file is large or the save code action should take longer than that configured setting, the action will be aborted. This does not affect formatters, only code actions on save. The default value is `750ms`, adjust it to your liking.

## Contributing/Enhancement requests

Please open an issue if you would like to contribute or request an enhancement.
