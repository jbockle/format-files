# Format Files README

[Format Files on VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=jbockle.jbockle-format-files)

Formats all files in the current workspace/selected folder/glob.  Due to the limitations in VSCode API, this opens each file, runs formatting command, saves the file (other save actions are started as well, to support features such as `tslint.autoFixOnSave` on typescript files), then closes it. The time to complete depends on the number of files and how large the files are.

## Usage

* Open command pallette (Ctrl+Shift+P) & enter "Start Format Files: Workspace"
  * Uses default exclude options
  * Keybindable to 'formatFiles.start.workspaces' command
* Open command pallette (Ctrl+Shift+P) & enter "Start Format Files: From Glob"
  * Prompts for a user defined glob pattern
  * Prompts to use default exclude options or none
  * Keybindable to 'formatFiles.start.fromGlob' command

> Will prompt to confirms to start formatting, check ***Format Files*** in Output pane for list of files that will be formatted

> A progress bar will appear on bottom right to indicate it's status

### Options

* `formatFiles.extensionsToInclude`: [ *default*: '\*' ]<br>comma delimited list of extensions to include between brace, i.e. "{ts,js,cp,cs}", if this is not specified all extensions are included
* `formatFiles.excludePattern`: [ *default*: '\*\*/node_modules, \*\*/.vscode, \*\*/dist/\*\*, \*\*/.chrome']<br>GlobPattern of paths to exclude.  Default excludePattern specifies node_modules and .vscode folder
* `formatFiles.inheritWorkspaceExcludedFiles`: [*default*: `true`]<br>Specifies that workspace globs specified in `files.exclude` that are `true` will be included in exclude glob

## Requirements

Each extension needs a formatter installed for it to work, or else the VSCode formatter will display an error that it does not have a formatter for the given extension.

Some recommended formatters:
* [Beautify - Javascript,JSON,CSS,Sass,HTML](https://marketplace.visualstudio.com/items?itemName=HookyQR.beautify)
* [C# FixFormat - C#](https://marketplace.visualstudio.com/items?itemName=Leopotam.csharpfixformat)
* [Clang Format - C,C++,Java,JavaScript,Objective-C,Objective-C++,Protobuf](https://marketplace.visualstudio.com/items?itemName=xaver.clang-format)
* [Prettier - Javascript,TypeScript,CSS](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
* [EditorConfig - *\**](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

## Known Issues

* If your code actions on save are not run on some of your files, it may be due to VS Code's `editor.codeActionsOnSaveTimeout` setting. If a file is large or the save code action should take longer than that configured setting, the action will be aborted. This does not affect formatters, only code actions on save. The default value is `750ms`, adjust it to your liking.

## Contributing/Enhancement requests

Please open an issue if you would like to contribute or request an enhancement
