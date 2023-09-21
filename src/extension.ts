import * as vscode from 'vscode';
import mainList from './docs'
import { getProjectPkgs } from './npm-helper';

const linkMap = new Map<string, string>();

function saveLink(label: string, description: string | undefined, link: string) {
	const key = `${label} (${description || ''})`
	linkMap.set(key, link);
}

function getLink(item: vscode.QuickPickItem) {
	const key = `${item.label} (${item.description || ''})`
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

let needUpdate = true;

async function updateItemsWithContext() {
	// TODO support multiple package.json
	if (!needUpdate) {
		return false;
	}
	needUpdate = false;

	const set = new Set();
	mainList.forEach((item) => {
		const matchPkgName = (item.alias || item.name).toLocaleLowerCase()
		set.add(matchPkgName);
	});
	const pkgItems: vscode.QuickPickItem[] = []
	const pkgs = await getProjectPkgs(vscode.window.activeTextEditor?.document.fileName || '');
	pkgs.forEach((pkg) => {
		if (pkg.startsWith('@types/')) {
			return;
		}
		if (!set.has(pkg.toLocaleLowerCase())) {
			pkgItems.push({
				label: pkg,
			});
			saveLink(pkg, '', `https://www.npmjs.com/package/${pkg}`);
		}
	});
	if (pkgItems.length > 0) {
		allItems.push(...pkgItems);
		return true;
	}
	return false;
}

export function activate(context: vscode.ExtensionContext) {	
	let disposable = vscode.commands.registerCommand('docsfinder.open', () => {
		const quickPick = vscode.window.createQuickPick();
		quickPick.placeholder = 'Search docs';
		// get selection text
		const selection = vscode.window.activeTextEditor?.document.getText(vscode.window.activeTextEditor?.selection) || '';
		if (selection.length < 100) {
			quickPick.value = selection;
		}
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

		updateItemsWithContext().then((needRefresh) => {
			if (needRefresh) {
				quickPick.items = allItems;
			}
		});
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
