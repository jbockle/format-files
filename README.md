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

Some recommended formatters:
* [Beautify - Javascript,JSON,CSS,Sass,HTML](https://marketplace.visualstudio.com/items?itemName=HookyQR.beautify)
* [C# FixFormat - C#](https://marketplace.visualstudio.com/items?itemName=Leopotam.csharpfixformat)
* [Clang Format - C,C++,Java,JavaScript,Objective-C,Objective-C++,Protobuf](https://marketplace.visualstudio.com/items?itemName=xaver.clang-format)
* [Prettier - Javascript,TypeScript,CSS](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
