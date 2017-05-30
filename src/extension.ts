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

        // Rename file to .tsx
        const filePath = getFilePath();
        const tsxPath = getTSXFileName(filePath);
        await fs.rename(filePath, tsxPath);

        const input = editor.document.getText();
        const result = convertToTypeScript(tsxPath);

        editor.edit(async (builder) => {
            const start = new vscode.Position(0, 0);
            const lines = result.split(/\n|\r\n/);
            const end = new vscode.Position(lines.length, lines[lines.length - 1].length)
            const allRange = new vscode.Range(start, end);
            builder.replace(allRange, result);
        })
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
