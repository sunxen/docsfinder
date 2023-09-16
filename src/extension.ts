// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import mainList from './docs'

const linkMap = new Map<string, string>();
function saveLink(label: string, description: string | undefined, link: string) {
	const key = `${label} (${description})`
	linkMap.set(key, link);
}
function getLink(item: vscode.QuickPickItem) {
	const key = `${item.label} (${item.description})`
	return linkMap.get(key);
}

const allItems: vscode.QuickPickItem[] = [];
mainList.forEach((item) => {
	allItems.push({
		label: item.name,
	});
	saveLink(item.name, item.description, item.link);
});

// children
mainList.forEach((item) => {
	if (item.children) {
		item.children.forEach((subItem) => {
			const label = item.name + ': ' + subItem.name;
			allItems.push({
				label,
				description: subItem.description,
			});
			saveLink(label, subItem.description, subItem.link);
		});
	}
});

export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "hello" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('hello.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World from hello!');

		const quickPick = vscode.window.createQuickPick();
		quickPick.placeholder = 'Search docs';
		// quickPick.matchOnDescription = true;
		quickPick.items = allItems;
		quickPick.onDidChangeSelection(selection => {
			if (selection[0]) {
				const link = getLink(selection[0]);
				if (link) {
					vscode.env.openExternal(vscode.Uri.parse(link));
				}
			}
			quickPick.hide();
		});
		quickPick.onDidHide(() => quickPick.dispose());
		quickPick.show();
		
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
