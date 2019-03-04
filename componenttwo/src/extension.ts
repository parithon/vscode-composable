// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ChatComponent, ParentExtension } from '../../common/lib';

let api: ChatComponent;
let connected: boolean;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
		console.log('Congratulations, your extension "componsabletwo" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('componenttwo.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from componenttwo!');
	});	

	context.subscriptions.push(disposable);

	const parent = vscode.extensions.getExtension<ParentExtension>('parithon.base');
	if(!parent) {
		vscode.window.showErrorMessage('Could not load parent extension');
		throw new Error('Could not load parent extension');
	}
	parent.exports.registerComponent('parithon.componenttwo');

	api = {
		connect,
		disconnect,
		isConnected
	};

	return api;
}

// this method is called when your extension is deactivated
export function deactivate() {}

export function connect(): Promise<void> {
	return new Promise<void>(resolve => {
		if (api.onConnecting) {
			api.onConnecting('parithon.componenttwo');
		}
		setTimeout(() => {
			connected = true;
			if (api.onConnected){
				api.onConnected('parithon.componenttwo');
			}
			resolve();
		}, 5000);
	});
}

export function disconnect(): Promise<void> {
	connected = false;
	if (api.onDisconnected) {
		api.onDisconnected('parithon.componenttwo');
	}
	return Promise.resolve();
}

export function isConnected(): boolean {
	return connected;
}
