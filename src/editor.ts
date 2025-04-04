import "@codingame/monaco-vscode-base-service-override";
import "@codingame/monaco-vscode-host-service-override";
import "@codingame/monaco-vscode-theme-defaults-default-extension";
import "@codingame/monaco-vscode-go-default-extension";
import "@codingame/monaco-vscode-files-service-override";
// import getConfigurationServiceOverride from "@codingame/monaco-vscode-configuration-service-override";
// import getKeybindingsServiceOverride from "@codingame/monaco-vscode-keybindings-service-override";
// import getLanguagesServiceOverride from "@codingame/monaco-vscode-languages-service-override";
// import getThemeServiceOverride from "@codingame/monaco-vscode-theme-service-override";
// import getTextMateServiceOverride from "@codingame/monaco-vscode-textmate-service-override";
import type { Logger } from "monaco-languageclient/tools";
import { WrapperConfig } from 'monaco-editor-wrapper';
import { LogLevel } from '@codingame/monaco-vscode-api';
import { defineDefaultWorkerLoaders } from 'monaco-editor-wrapper/workers/workerLoaders';
import * as monaco from "@codingame/monaco-vscode-editor-api";
import { useWorkerFactory as workerFactory } from "monaco-languageclient/workerFactory";
monaco.languages.register({ id: "plaintext-log" });
monaco.editor.defineTheme("logTheme", {
	base: "vs", // Light theme
	inherit: true,
	rules: [
		{ token: "timestamp", foreground: "#FFA500" }, // Grey
		{ token: "debug", background: "#E8F5E9", foreground: "#2E7D32" }, // Light Green
		{ token: "info", background: "#E3F2FD", foreground: "#1565C0" }, // Light Blue
		{ token: "warn", background: "#FFF3E0", foreground: "#E65100" }, // Light Orange
		{ token: "error", background: "#FFEBEE", foreground: "#B71C1C" }, // Light Red
		{ token: "dpanic", background: "#F3E5F5", foreground: "#6A1B9A" }, // Light Purple
		{ token: "panic", background: "#FBE9E7", foreground: "#D84315" }, // Light Brown
		{ token: "fatal", background: "#FFCDD2", foreground: "#C62828" }, // Darker Red
		// Stack trace styling
		{ token: "stack-trace-header", foreground: "#37474F", fontStyle: "bold" }, // Darker gray
		{ token: "stack-trace-body", foreground: "#616161", background: "#EEEEEE" }, // Light gray bg
		{ token: "stack-trace-file", foreground: "#263238", fontStyle: "italic" }, // Dark gray for file paths
	],
	colors: {
		"editor.background": "#FFFFFF",
		"editor.foreground": "#000000",
	},
});
monaco.languages.setMonarchTokensProvider("plaintext-log", {
	tokenizer: {
		root: [
			[/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(?:Z|\+\d{4})/, "timestamp"],
			[/.*\bdebug\b.*/, "debug"],
			[/.*\binfo\b.*/, "info"],
			[/.*\bwarn\b.*/, "warn"],
			[/.*\berror\b.*/, "error"],
			[/.*\bdpanic\b.*/, "dpanic"],
			[/.*\bpanic\b.*/, "panic"],
			[/.*\bfatal\b.*/, "fatal"],
			[/goroutine\s+\d+\s+\[.*\]/, "stack-trace-header"], // "goroutine 36 [running]"
			[/[a-zA-Z0-9_/]+\.\w+:\d+/, "stack-trace-file"], // File paths
			[/^\s{4}.*/, "stack-trace-body"], // Indented stack content
		],
	},
});
export const getUserConfig = (): WrapperConfig => {
  const workerLoaders = defineDefaultWorkerLoaders();
  return {
    id: `1`,
    $type: "extended",
	logLevel: LogLevel.Debug,
    vscodeApiConfig: {
      serviceOverrides: {
        // ...getKeybindingsServiceOverride(),
        // ...getTextMateServiceOverride(),
        // ...getThemeServiceOverride(),
        // ...getLanguagesServiceOverride(),
        // ...getConfigurationServiceOverride(),
      },
      userConfiguration: {
		json: JSON.stringify({
			"workbench.colorTheme": "Default Light Modern",
			"editor.wordBasedSuggestions": "off",
			"editor.guides.bracketPairsHorizontal": true,
			"editor.experimental.asyncTokenization": false,
		}),
      },
    },
    editorAppConfig: {
      monacoWorkerFactory: (logger?: Logger) => {
        workerFactory({
          workerLoaders,
          logger,
        });
      },
      editorOptions: {
        language: "go",
      },
      codeResources: {
        original: {
			text: "package test",
			enforceLanguageId: "go",
			uri: "/workspace/test.go"
		},
      },
    },
  };
};
