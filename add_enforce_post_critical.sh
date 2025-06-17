#!/bin/bash
# Task: Modify vite.config.ts to add enforce: 'post' to rollup-plugin-critical

# Define the new critical plugin block with enforce: 'post'
# Note: Using a here-document for readability and to avoid complex quoting.
read -r -d '' new_critical_block <<'EOF'
{
			// name property removed to avoid conflict
			...critical({
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
			}),
			enforce: 'post',
		} as never,
EOF

# The original critical plugin block's pattern.
# This needs to be a very precise regex matching the existing block.
# \s* handles flexible whitespace. Literal parentheses, brackets, slashes need escaping.
# Comments also need to be accounted for if they are part of the string to match.
# Added ^\\s* to anchor the match to the beginning of a line (after any leading whitespace).
original_critical_pattern="^\\s*critical\\(\\{\\s*criticalUrl: '\\/',\\s*criticalBase: '\\.\\/dist\\/',\\s*criticalPages: \\[\s*\\{\\s*uri: 'index\\.html',\\s*template: 'index\\.html'\\s*\\}\s*\\],\\s*\\/\\/ Adjust Puppeteer arguments if necessary, e\\.g\\., for running in a CI environment without a sandbox\\s*puppeteerArgs: \\['--no-sandbox', '--disable-setuid-sandbox'\\]\\s*\\}\\) as never,"

# Check if the original pattern exists
if ! perl -0777 -ne "print if /$original_critical_pattern/ms" vite.config.ts | grep -q .; then
    echo "Original critical plugin block not found as expected. No changes made."
    exit 1
fi

# Using perl for robust multiline find and replace.
# -0777 slurps the whole file. -p wraps the script in a loop and prints output. -i edits in place.
# Using @ as delimiter for s/// to avoid excessive escaping of /
perl -0777 -pi -e "s@$original_critical_pattern@$new_critical_block@ms" vite.config.ts

if [ $? -eq 0 ]; then
  # Check if replacement actually happened by seeing if the new block is there
  # We'll check for 'enforce: 'post',' as the 'name' property was removed.
  if perl -0777 -ne "print if /enforce: 'post',/ms" vite.config.ts | grep -q .; then
    echo "vite.config.ts successfully modified: critical plugin updated with enforce: 'post'."
  else
    echo "Perl script ran, but the 'enforce: 'post',' was not found. Replacement may have failed silently or pattern mismatch."
    exit 1 # Indicate potential failure
  fi
else
  echo "Perl script execution failed."
  exit 1
fi

# Optional: Verify with npm run build (if time permits and necessary)
# echo "Running npm run build to verify changes..."
# npm run build
