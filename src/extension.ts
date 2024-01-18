
import * as vscode from 'vscode';

function generateCSS() {
	if (vscode.window.activeTextEditor) {
		let allSelectedText = '';
		vscode.window.activeTextEditor.selections.forEach((element) => {
			let selectedText = vscode.window.activeTextEditor?.document.getText(element);
			allSelectedText += selectedText;
		});
		if (allSelectedText) {
			let regex = /class="(.+?)"|class='(.+?)'/gi;
			let matches = [...allSelectedText.matchAll(regex)];
			if (matches) {
				const classes = matches.map((match) => match[1] || match[2]);
				const newClass: {
					[key: string]: {}
				} = {};
				classes.forEach(str => newClass[`.${str}`] = {});
				vscode.env.clipboard.writeText(Object.keys(newClass)
					.map(className => `${className}{\n  \n}`)
					.join('\n \n'));
				vscode.window.showInformationMessage('CSS classes copied to clipboard.');

			}
		}
	}
}
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('quickSelector.generate', generateCSS));
	console.log('Congratulations, your extension "quickSelector" is now active and ready!');
}
// This method is called when your extension is deactivated
export function deactivate() {

}