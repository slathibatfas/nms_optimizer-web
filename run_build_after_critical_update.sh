#!/bin/bash
# Task: Re-run the build after modifying rollup-plugin-critical configuration.

echo "Attempting to run the production build with the updated critical CSS plugin configuration..."
npm run build

if [ $? -eq 0 ]; then
  echo "Build completed successfully."
  echo "Please manually inspect dist/index.html to verify if critical CSS is now correctly inlined."
  echo "Also, test the site's appearance and performance from the dist folder."
else
  echo "Build failed. Please check the logs."
  # Attempt to restore vite.config.ts if the build fails, as the change might be problematic.
  # This requires having a backup or using git. For now, just notify.
  echo "Consider reverting the changes to vite.config.ts for rollup-plugin-critical if issues persist."
  exit 1 # Exit with an error code to indicate build failure
fi

exit 0
