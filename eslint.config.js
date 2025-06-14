// eslint.config.js
import path from "node:path";
import { fileURLToPath } from "node:url";

import pluginJs from "@eslint/js";
import pluginImport from "eslint-plugin-import";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginPrettier from "eslint-plugin-prettier";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default tseslint.config(
	// Global ignore
	{
		ignores: ["dist/**", "node_modules/**", ".wrangler/**", "coverage/**", "eslint.config.js"],
	},

	// Base JavaScript rules
	pluginJs.configs.recommended,

	// Base TypeScript rules
	...tseslint.configs.recommendedTypeChecked,

	// React source files
	{
		files: ["src/**/*.{ts,tsx}"],
		languageOptions: {
			parserOptions: {
				project: "./tsconfig.json",
				tsconfigRootDir: __dirname,
			},
			globals: globals.browser,
		},
		settings: {
			react: { version: "detect" },
		},
		plugins: {
			react: pluginReact,
			"react-hooks": pluginReactHooks,
			"jsx-a11y": pluginJsxA11y,
		},
		rules: {
			...pluginReact.configs.recommended.rules,
			...pluginReactHooks.configs.recommended.rules,
			...pluginJsxA11y.configs.recommended.rules,
			"react/react-in-jsx-scope": "off",
			"react/jsx-filename-extension": [1, { extensions: [".tsx"] }],
		},
	},

	// Config / Node.js files
	{
		files: ["*.config.{js,cjs,ts}", "postcss.config.js", "tailwind.config.js"],
		languageOptions: {
			parserOptions: {
				project: "./tsconfig.node.json",
				tsconfigRootDir: __dirname,
			},
			globals: globals.node,
		},
		rules: {
			"@typescript-eslint/no-var-requires": "off",
			"import/no-extraneous-dependencies": ["error", { devDependencies: true }],
		},
	},

	// Import & sorting
	{
		plugins: {
			import: pluginImport,
			"simple-import-sort": pluginSimpleImportSort,
		},
		settings: {
			"import/resolver": {
				node: true,
				typescript: {
					project: ["./tsconfig.json", "./tsconfig.node.json"],
				},
			},
			"import/parsers": {
				"@typescript-eslint/parser": [".ts", ".tsx"],
			},
		},
		rules: {
			...pluginImport.configs.recommended.rules,
			...pluginImport.configs.typescript.rules,
			"simple-import-sort/imports": "error",
			"simple-import-sort/exports": "error",
			"import/order": "off",
		},
	},

	// Prettier rules (must come *after* others)
	{
		plugins: {
			prettier: pluginPrettier,
		},
		rules: {
			"prettier/prettier": "warn",
		},
	},

	// Custom global rules
	{
		rules: {
			"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
		},
	}
);
