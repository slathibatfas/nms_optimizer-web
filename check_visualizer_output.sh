#!/bin/bash
# Run the production build to generate the visualizer report
npm run build

# Check for the visualizer output file. Common names are stats.html or report.html.
# The plugin options in vite.config.ts didn't specify a filename, so it might be 'stats.html' by default.
# List the root directory to find it.
ls -lh stats.html || ls -lh report.html || ls -lh dist/stats.html || ls -lh dist/report.html || ls -lh *.html
