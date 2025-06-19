import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import puppeteer from "puppeteer-core";
import critical from "rollup-plugin-critical";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import compression from "vite-plugin-compression";

const modernTargets = browserslist(
	"last 2 Chrome versions, last 2 Firefox versions, last 2 Edge versions, last 2 Safari versions, not dead"
);

export default defineConfig(() => {
	const isDocker = process.env.DOCKER === "true";

	const criticalPlugin = !isDocker
		? {
			...critical({
				criticalUrl: "https://nms-optimizer.app",
				criticalBase: "./dist/",
				criticalPages: [
					{
						uri: "/",
						template: "index.html",
					},
				],
				puppeteer,
				puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
				puppeteerExecutablePath: "/app/.apt/usr/bin/google-chrome-stable",
			}),
			enforce: "post",
		}
		: null;

	return {
		plugins: [
			react(),
			tailwindcss(),

			compression({
				algorithm: "brotliCompress",
				ext: ".br",
				threshold: 10240,
				deleteOriginFile: false,
			}),

			compression({
				algorithm: "gzip",
				ext: ".gz",
				threshold: 10240,
				deleteOriginFile: false,
			}),

			...(criticalPlugin ? [criticalPlugin] : []),

			visualizer({ open: false, gzipSize: true, brotliSize: true }),
		],

		server: {
			host: "0.0.0.0",
			port: 5173,
		},

		css: {
			transformer: "lightningcss",
			lightningcss: {
				targets: browserslistToTargets(modernTargets),
			},
		},

		build: {
			target: "es2020",
			minify: "esbuild",
			cssCodeSplit: true,
			sourcemap: true,
			cssMinify: "lightningcss",

			rollupOptions: {
				output: {
					manualChunks(id) {
						if (!id.includes("node_modules")) return;

						if (
							id.includes("react-markdown") ||
							id.includes("remark-") ||
							id.includes("rehype-") ||
							id.includes("micromark") ||
							id.includes("mdast-") ||
							id.includes("unist-") ||
							id.includes("vfile") ||
							id.includes("zwitch") ||
							id.includes("bail") ||
							id.includes("trough") ||
							id.includes("decode-named-character-reference") ||
							id.includes("parse-entities")
						) {
							return "markdown";
						}

						if (
							id.includes("i18next") ||
							id.includes("react-i18next") ||
							id.includes("@formatjs") ||
							id.includes("intl-messageformat")
						) {
							return "i18n";
						}

						return "vendor";
					},

					assetFileNames: (assetInfo) => {
						if (assetInfo.name?.endsWith(".css")) {
							return "assets/[name]-[hash].css";
						}
						return "assets/[name]-[hash].[ext]";
					},
				},
			},
		},

		test: {
			globals: true,
			environment: "jsdom",
			setupFiles: "./src/test/setup.ts",
		},
	};
});
