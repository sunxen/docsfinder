import * as vscode from 'vscode';
import mainList, { DocItem } from './docs'
import { getProjectPkgs } from './npm-helper';
import { openWeb } from './web';

const docQuickPickMap = new Map<vscode.QuickPickItem, DocItem>();

const qpItems: vscode.QuickPickItem[] = [];
mainList.forEach((doc) => {
	const qp: vscode.QuickPickItem = {
		label: doc.name,
	}
	qpItems.push(qp);
	docQuickPickMap.set(qp, doc)
});

// children
mainList.forEach((doc) => {
	if (doc.children) {
		doc.children.forEach((subDoc) => {
			const label = doc.name + ': ' + subDoc.name;
			const qp = {
				label,
				description: subDoc.description,
			}
			qpItems.push(qp);
			docQuickPickMap.set(qp, subDoc)
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
	mainList.forEach((doc) => {
		const npmName = (doc.npm || doc.name).toLocaleLowerCase()
		set.add(npmName);
	});
	const pkgItems: vscode.QuickPickItem[] = []
	const pkgs = await getProjectPkgs(vscode.window.activeTextEditor?.document.fileName || '');
	pkgs.forEach((pkg) => {
		if (pkg.startsWith('@types/')) {
			return;
		}
		if (!set.has(pkg.toLocaleLowerCase())) {
			const qp = {
				label: pkg,
			}
			const doc = { name: pkg, link: `https://www.npmjs.com/package/${pkg}` }
			pkgItems.push();
			docQuickPickMap.set(qp, doc)
		}
	});
	if (pkgItems.length > 0) {
		qpItems.push(...pkgItems);
		return true;
	}
	return false;
}

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('docsfinder.open', () => {
		const viewerType = vscode.workspace.getConfiguration('docsFinder').viewerType;
		const quickPick = vscode.window.createQuickPick();
		quickPick.placeholder = 'Search docs';
		// get selection text
		const selection = vscode.window.activeTextEditor?.document.getText(vscode.window.activeTextEditor?.selection) || '';
		if (selection.length < 100) {
			quickPick.value = selection;
		}
		quickPick.items = qpItems;
		quickPick.onDidChangeSelection(selection => {
			const qp = selection[0]
			const doc = docQuickPickMap.get(qp);
			if (doc) {
				if (viewerType === 'Browser' || !doc.iframe) {
					vscode.env.openExternal(vscode.Uri.parse(doc.link));
				} else {
					openWeb(context, doc.link, doc.name, viewerType === 'VS Code - column one')
				}
			}
			quickPick.hide();
		});
		quickPick.onDidHide(() => quickPick.dispose());
		quickPick.show();

		updateItemsWithContext().then((needRefresh) => {
			if (needRefresh) {
				quickPick.items = qpItems;
			}
		});
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
