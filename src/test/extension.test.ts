import * as assert from 'assert';
import * as vscode from 'vscode';
import * as myExtension from '../extension';

suite('QuickSelector Extension Test Suit', () => {
	vscode.window.showInformationMessage('Start QuickSelector tests.');
	test('Generate CSS', async () => {
		const testText = '<div class="test-class"></div>';
		const testUri = vscode.Uri.parse('untitled:test.html');
		const testDocument = await vscode.workspace.openTextDocument(testUri);
		await vscode.window.showTextDocument(testDocument);
		await vscode.window.activeTextEditor?.edit(builder => builder.insert(new vscode.Position(0, 0), testText));
		await vscode.commands.executeCommand('editor.action.selectAll');
		await vscode.commands.executeCommand('editor.action.clipboardCopyAction');
		await myExtension.generateCSS();
		const clipboardContent = await vscode.env.clipboard.readText();
		assert.strictEqual(clipboardContent, '.test-class{\n  \n}');
	});
});
