'use strict';
import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';

import { run as convertToTypeScript } from 'react-js-to-ts';

export function activate(context: vscode.ExtensionContext) {

    let disposable = vscode.commands.registerCommand('extension.convertReactToTypeScript', async () => {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            return;
        }

        const filePath = getFilePath();
        const tsxPath = getTSXFileName(filePath);
        await fs.rename(filePath, tsxPath);
        const result = convertToTypeScript(tsxPath);
        await fs.writeFile(tsxPath, result);
        const file = await vscode.workspace.openTextDocument(tsxPath);
        vscode.window.showTextDocument(file);
    });

    context.subscriptions.push(disposable);
}

function getFilePath(): string {
    const activeEditor: vscode.TextEditor = vscode.window.activeTextEditor;
    const document: vscode.TextDocument = activeEditor && activeEditor.document;

    return document && document.fileName;
}

function getTSXFileName(fileName: string) {
    const ext = path.extname(fileName).replace(/^\./, '');
    const extNameRegex = new RegExp(`${ext}$`);
    return fileName.replace(extNameRegex, 'tsx');
}

// this method is called when your extension is deactivated
export function deactivate() {
}
