# Format Files README

Formats all files in the current workspace/or selected folder

* Use:
  * Open command pallette (Ctrl+Shift+P) & enter "Format Files"
  * Create keybinding to 'editor.action.formatFiles' command
  * Right click a workspace folder and select 'Format Files' to format all files in directory
* Options:
  * formatFiles.include: comma delimted list of extensions to include, i.e. "ts,js,cp,cs", if this is not specified all extensions are included
  * formatFiles.excludePattern: GlobPattern of paths to exclude.  Default excludePattern specifies node_modules and .vscode folder

## Requirements

Each extension needs a formatter installed for it to work, or else the VSCode formatter will display an error that it does not have a formatter for the given extension.