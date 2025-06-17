#!/bin/bash
# Task: Add and configure rollup-plugin-critical in vite.config.ts

# Read the existing vite.config.ts
config_content=$(cat vite.config.ts)

# Check if 'rollup-plugin-critical' is already imported
if grep -q 'from "rollup-plugin-critical"' vite.config.ts; then
  echo "rollup-plugin-critical seems to be already imported. Exiting to avoid duplication."
  exit 0
fi

# Define the import string to be added
new_import_statement='import critical from "rollup-plugin-critical";'

# Add the import statement for critical
# Ensuring it's placed with other imports.
visualizer_import_pattern='from "rollup-plugin-visualizer";'
define_config_pattern='import { defineConfig, type UserConfigExport } from "vitest/config";'

if [[ $config_content == *"$visualizer_import_pattern"* ]]; then
  # Insert after the visualizer import
  replacement_imports="$visualizer_import_pattern\n$new_import_statement"
  config_content="${config_content/$visualizer_import_pattern/$replacement_imports}"
else
  # Fallback: Insert after defineConfig import
  replacement_imports="$define_config_pattern\n$new_import_statement"
  config_content="${config_content/$define_config_pattern/$replacement_imports}"
fi

# Construct the critical plugin configuration string
# Note: Using a simple placeholder for criticalUrl and criticalBase for now.
# These might need to be adjusted. The plugin often works relative to the output dir.
# The plugin will operate on the `dist` directory after the build.
critical_plugin_config="critical({
			criticalUrl: '/',
			criticalBase: './dist/',
			criticalPages: [
				{
					uri: 'index.html',
					template: 'index.html'
				}
			],
			// Adjust Puppeteer arguments if necessary, e.g., for running in a CI environment without a sandbox
			puppeteerArgs: ['--no-sandbox', '--disable-setuid-sandbox']
		}) as never,"

# Add the critical plugin to the plugins array
# Let's place it just before the visualizer plugin.
visualizer_plugin_pattern='visualizer({ open: false, gzipSize: true, brotliSize: true }) as never,'
if [[ $config_content == *"$visualizer_plugin_pattern"* ]]; then
  new_plugins_config="$critical_plugin_config\n\t\t$visualizer_plugin_pattern" # Added \t\t for indentation
  config_content="${config_content/$visualizer_plugin_pattern/$new_plugins_config}"
else
  echo "Visualizer plugin not found in the expected format. Critical plugin not added to plugins array."
  # Decide if this is a fatal error or if we should try to append it differently
  # For now, exiting might be safer if the structure isn't as expected.
  exit 1
fi

# Write the modified content back to vite.config.ts
echo -e "$config_content" > vite.config.ts

echo "vite.config.ts modified to include rollup-plugin-critical."

# Attempt to run the build to see if it completes with the new plugin.
npm run build
