import * as vscode from 'vscode';

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

export function openWeb(context: vscode.ExtensionContext, url: string, label: string, columnOne = false) {
    // TODO singleton
    const panel = vscode.window.createWebviewPanel(
        'docsfinder',
        label,
        columnOne ? vscode.ViewColumn.One : vscode.ViewColumn.Two,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
        }
    );

    // And set its HTML content
    panel.webview.html = getWebviewContent(url);

    // Handle messages from the webview
    panel.webview.onDidReceiveMessage(
        message => {
            // set state
            if (message.type === 'setState') {
                const state: any = context.globalState.get('state') || {};
                for (const key of Object.keys(message.state)) {
                    state[key] = message.state[key];
                }
                context.globalState.update('state', state);
            }
            // get state
            if (message.type === 'getState') {
                const state = context.globalState.get('state');
                panel.webview.postMessage({
                    type: 'loadState',
                    state,
                });
            }
            // copy
            if (message.type === 'copy') {
                vscode.env.clipboard.writeText(message.text);
            }
            // open browser
            if (message.type === 'openBrowser') {
                vscode.env.openExternal(vscode.Uri.parse(message.url));
            }
        },
        undefined,
        context.subscriptions
    );
}

function getWebviewContent(url: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
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
		<script>
const vscode = acquireVsCodeApi();
const iframe = document.getElementById('cf');

window.addEventListener('message', function(event) {
	// just relay message
	const message = event.data;
	if (message.type === 'setState' || message.type === 'getState' || message.type === 'copy' || message.type === 'openBrowser') {
		vscode.postMessage(message)
	}
	if (message.type === 'loadState') {
		iframe.contentWindow.postMessage(message, '*')
	}
});
		</script>
</body>
</html>`;
}
