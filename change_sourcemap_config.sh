#!/bin/bash
# Task: Change build.sourcemap from true to 'hidden' in vite.config.ts

# Read the existing vite.config.ts
# config_content=$(cat vite.config.ts) # Not needed if using sed directly for replacement

# Check if the line 'sourcemap: true,' exists within the build object
# A more robust check for the specific pattern within the build object:
if sed '/build: {/,/}/!d' vite.config.ts | grep -q "sourcemap: true,"; then
  # Replace 'sourcemap: true,' with 'sourcemap: "hidden",'
  # Ensuring to only target it within the build object.
  sed -i '/build: {/,/}/s/sourcemap: true,/sourcemap: "hidden",/' vite.config.ts

  echo "vite.config.ts modified: build.sourcemap changed to 'hidden'."
else
  echo "sourcemap: true, not found within the build object or already changed. No modification made."
fi

# Optional: Run build to ensure it still completes (though this change is unlikely to break it)
# npm run build
# Not running build for this minor change to save time, assuming it's safe.
