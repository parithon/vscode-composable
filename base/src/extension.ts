// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ChatComponent } from '../../common/lib/components';

let registeredChatComponents: {
	id: string;
	isConnected: boolean,
	component: ChatComponent
}[] = [];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const showComponentsCommand = vscode.commands.registerCommand('base.showComponents', showComponentsHandler);
	const startCommand = vscode.commands.registerCommand('base.startChat', startChatHandler);
	const stopCommand = vscode.commands.registerCommand('base.stopChat', stopChatHandler);

	context.subscriptions.push(...[showComponentsCommand, startCommand, stopCommand]);

	function showComponentsHandler() {
		const componentNames = registeredChatComponents.map(component => component.id);
		vscode.window.showInformationMessage(componentNames.join('\n'));
	}

	function startChatHandler() {
		registeredChatComponents.forEach(chatComponent => {
			if (!chatComponent.component.isConnected()) {
				chatComponent.component.connect();
			}
		});
	}

	function stopChatHandler() {
		registeredChatComponents.forEach(chatComponent => {
			if(chatComponent.component.isConnected()) {
				chatComponent.component.disconnect();
			}
		});
	}

	let api = {
		registerComponent
	};

	return api;

}

export function registerComponent(extensionId: string) {
	const component = vscode.extensions.getExtension<ChatComponent>(extensionId);
	if (!component) { return; }
	const rc = setInterval(() => {
		if (component.isActive) {
			clearInterval(rc);
			component.exports.onConnecting = onConnectingHandler;
			component.exports.onConnected = onConnectedHandler;
			component.exports.onDisconnected = onDisconnectedHandler;
			registeredChatComponents.push({
				id: component.id,
				isConnected: false,
				component: component.exports
			});
		}
	}, 200);
}

// this method is called when your extension is deactivated
export function deactivate() { }

function onConnectingHandler(extensionId: string) {
	console.log(`${extensionId}: connecting...`);
}

function onConnectedHandler(extensionId: string) {
	console.log(`${extensionId}: connected.`);
}

function onDisconnectedHandler(extensionId: string) {
	console.log(`${extensionId}: disconnected.`);
}