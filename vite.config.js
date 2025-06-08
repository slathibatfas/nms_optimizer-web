import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import { visualizer } from "rollup-plugin-visualizer";
var config = defineConfig({
	plugins: [react(), tailwindcss(), visualizer({ open: true, gzipSize: true, brotliSize: true })],
	server: {
		host: "0.0.0.0",
		port: 5173,
	},
	css: {
		transformer: "lightningcss",
		lightningcss: {
			targets: browserslistToTargets(browserslist(">= 0.25%")),
		},
	},
	build: {
		minify: "esbuild",
		cssCodeSplit: true,
		sourcemap: false,
		rollupOptions: {
			output: {
				assetFileNames: function (assetInfo) {
					var _a;
					if ((_a = assetInfo.name) === null || _a === void 0 ? void 0 : _a.endsWith(".css")) {
						return "assets/[name]-[hash].css";
					}
					return "assets/[name]-[hash].[ext]";
				},
				manualChunks: function (id) {
					if (id.includes("node_modules")) return "vendor";
				},
			},
		},
		cssMinify: "lightningcss",
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./src/test/setup.ts", // create this file if needed
	},
});
export default config;
