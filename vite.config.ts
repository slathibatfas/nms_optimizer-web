import { defineConfig, type UserConfigExport } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import { visualizer } from "rollup-plugin-visualizer";
import compression from "vite-plugin-compression";

const modernTargets = browserslist(
	"last 2 Chrome versions, last 2 Firefox versions, last 2 Edge versions, last 2 Safari versions, not dead"
);

const config: UserConfigExport = defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		// Precompress with Brotli
		compression({
			algorithm: "brotliCompress",
			ext: ".br",
			threshold: 10240,
			deleteOriginFile: false,
		}),

		// Precompress with Gzip
		compression({
			algorithm: "gzip",
			ext: ".gz",
			threshold: 10240,
			deleteOriginFile: false,
		}),

		// Bundle visualizer
		visualizer({ open: false, gzipSize: true, brotliSize: true }) as never,
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
		sourcemap: false,
		cssMinify: "lightningcss",

		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("node_modules")) {
						return "vendor";
					}
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
});

export default config;
