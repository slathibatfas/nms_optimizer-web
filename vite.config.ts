import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import browserslist from 'browserslist';
import { browserslistToTargets } from 'lightningcss';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',  // Listen on all network interfaces
    port: 5173        // Use the desired port
  },
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(browserslist('>= 0.25%')),
    }
  },
  build: {
    minify: 'esbuild', // Default option, optimized for speed
    cssCodeSplit: true, // Ensures CSS is split for better optimization
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/[name]-[hash].css'; // Custom CSS output pattern
          }
          return 'assets/[name]-[hash].[ext]';
        }
      }
    },
    cssMinify: 'lightningcss'
  }
});