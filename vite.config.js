import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import { visualizer } from "rollup-plugin-visualizer";
import compression from "vite-plugin-compression";
var modernTargets = browserslist("last 2 Chrome versions, last 2 Firefox versions, last 2 Edge versions, last 2 Safari versions, not dead");
var config = defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        // Precompress with Brotli
        compression({
            algorithm: "brotliCompress",
            ext: ".br",
            threshold: 10240,
            deleteOriginFile: true,
        }),
        // Precompress with Gzip
        compression({
            algorithm: "gzip",
            ext: ".gz",
            threshold: 10240,
            deleteOriginFile: true,
        }),
        // Bundle visualizer
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
        sourcemap: false,
        cssMinify: "lightningcss",
        rollupOptions: {
            output: {
                manualChunks: function (id) {
                    if (id.includes("node_modules")) {
                        return "vendor";
                    }
                },
                assetFileNames: function (assetInfo) {
                    var _a;
                    if ((_a = assetInfo.name) === null || _a === void 0 ? void 0 : _a.endsWith(".css")) {
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
