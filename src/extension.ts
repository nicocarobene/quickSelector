
import * as vscode from 'vscode';

export function generateCSS() {
	if (vscode.window.activeTextEditor) {
		let allSelectedText = '';
		vscode.window.activeTextEditor.selections.forEach((element) => {
			let selectedText = vscode.window.activeTextEditor?.document.getText(element);
			allSelectedText += selectedText;
		});
		if (allSelectedText) {
			const [classes, dataS, idS] = matchesSelector(allSelectedText);
			if (classes) {
				const classSelector = classes.map((match) => {
					const result = match[1] || match[2];
					return result.split(' ');
				});
				const idSelector = idS.map((match) => match[1] || match[2]);
				const dataSelector = dataS.map((match) => match[0].split("="));
				writeClassCSS({ classSelector, idSelector, dataSelector });
			}
		}
	}
}
export function writeClassCSS({ classSelector, idSelector, dataSelector }: { classSelector: string[] | string[][], idSelector: string[], dataSelector: string[][] }) {
	const newClass: { [key: `.${string}` | `#${string}` | `[${string}]`]: {} } = {};
	idSelector.forEach(str => newClass[`#${str}`] = {});
	dataSelector.forEach(str => newClass[`[${str[0]}=${str[1]}]`] = {});
	classSelector.forEach(str => newClass[`.${Array.isArray(str) ? str.join(' .') : str}`] = {});
	vscode.env.clipboard.writeText(Object.keys(newClass)
		.map(className => `${className}{\n  \n}`)
		.join('\n \n'));
	vscode.window.showInformationMessage('CSS classes copied to clipboard.', previewCSS(newClass));
}

export function matchesSelector(allSelectedText: string): RegExpMatchArray[][] {
	const regexClass = /class="(.+?)"|class='(.+?)'/gi;
	const regexID = /id="(.+?)"|id='(.+?)'/gi;
	const regexdata = /data-\w+="(.+?)"|data-\w+='(.+?)'/gi;
	const matches = [...allSelectedText.matchAll(regexClass)];
	const dataS = [...allSelectedText.matchAll(regexdata)];
	const idS = [...allSelectedText.matchAll(regexID)];
	return [matches, dataS, idS];
}
export function previewCSS(cssObject: { [key: string]: {} }): string {
	const previewText = Object.keys(cssObject)
		.map(className => `${className}\n`)
		.join('\n');
	return 'Preview of CSS Styles:\n\n' + previewText;
}

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('quickSelector.generate', generateCSS));
	console.log('Congratulations, your extension "quickSelector" is now active and ready!');
}
// This method is called when your extension is deactivated
export function deactivate() {

}