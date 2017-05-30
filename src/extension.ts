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

        const input = editor.document.getText();
        const inputPath = path.join(__dirname, randomFileName());
        await fs.writeFile(inputPath, input);
        const result = convertToTypeScript(inputPath);
        editor.edit(async (builder) => {
            const start = new vscode.Position(0, 0);
            const lines = result.split(/\n|\r\n/);
            const end = new vscode.Position(lines.length, lines[lines.length - 1].length)
            const allRange = new vscode.Range(start, end);
            builder.replace(allRange, result);

            // vscode

            // Delete temp file
            await fs.remove(inputPath);
        })
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

function randomFileName() {
    return Math.random().toString(36).substring(2) + '.ts';
}
