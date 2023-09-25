import * as vscode from 'vscode';
import { showGithubReadme } from './github';
import { DocItem } from './docs';

function getDefaultTheme() {
  const themeName = vscode.workspace.getConfiguration().get('workbench.colorTheme');
	if (typeof themeName !== 'string') {
		return 'dark';
	}
  if (themeName.endsWith('Dark') || themeName.endsWith('Black')) {
		return 'dark';
	}
	return 'light';
}

export function openDoc(doc: DocItem, viewerType: string) {
    const isNpm = doc.link.includes('npmjs.com');

    if (viewerType === 'Browser' || (!isNpm && !doc.iframe)) {
        vscode.env.openExternal(vscode.Uri.parse(doc.link));
        return;
    }
    
    const column = viewerType === 'VS Code - column one' ? vscode.ViewColumn.One : vscode.ViewColumn.Two;
    // TODO singleton
    const panel = vscode.window.createWebviewPanel(
        'docsfinder',
        doc.name,
        column,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
        }
    );
    if (doc.iframe) {
        showPageInIframe(panel.webview, doc.link);
        return;
    }
    showGithubReadme(panel.webview, doc.name)
}

function showPageInIframe(webview: vscode.Webview, url: string) {
    webview.html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Docs Finder</title>
		<style type="text/css">
			iframe {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				border: none;
			}
		</style>
</head>
<body>
    <iframe id="cf" src="${url}"></iframe>
</body>
</html>`;
}
