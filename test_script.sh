#!/bin/bash
echo "Starting test_script.sh"
original_js_line="import { defineConfig, type UserConfigExport } from \"vitest/config\";"
dummy_content="$original_js_line"
echo "Original content: $dummy_content"

# Define the replacement text, which includes the original line and the new import
replacement_text='import { defineConfig, type UserConfigExport } from "vitest/config";
import critical from "rollup-plugin-critical";'

# Perform the replacement
# Note: Using a simpler pattern for the search string to avoid complex escaping issues.
# We are replacing the whole original_js_line with replacement_text.
dummy_content="${dummy_content/$original_js_line/$replacement_text}"

echo "Modified content: $dummy_content"
echo "test_script.sh finished"
