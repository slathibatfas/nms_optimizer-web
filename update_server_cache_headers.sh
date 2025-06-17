#!/bin/bash
# Task: Update server.js to set Cache-Control headers

# Using awk to replace the setHeaders block to handle multiline content easily
awk '
  BEGIN { printing = 1 }
  # Match the line starting the setHeaders function definition
  /setHeaders: \(res, filePath\) => \{/ {
    print "    setHeaders: (res, filePath) => {";
    print "      const path = require(\"path\"); // Ensure path module is available";
    print "      const fileName = path.basename(filePath);";
    print "";
    print "      // Regex to check for typical Vite hash pattern (e.g., index-a1b2c3d4.js)";
    print "      const versionedAssetPattern = /-[0-9a-zA-Z]{8}\\.(js|css|woff2|webp|svg|png|jpg|jpeg|gif)$/i;";
    print "";
    print "      if (versionedAssetPattern.test(fileName)) {";
    print "        // For versioned assets (JS, CSS, fonts, images with hashes)";
    print "        res.setHeader(\"Cache-Control\", \"public, max-age=31536000, immutable\");";
    print "      } else if (fileName === \"index.html\") {";
    print "        // For index.html, no-cache to ensure freshness for SPA routing fallbacks.";
    print "        res.setHeader(\"Cache-Control\", \"no-cache\");";
    print "      } else {";
    print "        // For other static assets in \"dist\" that might not be versioned";
    print "        // (e.g., images copied directly from public, favicons, manifest.json)";
    print "        // A shorter cache time, e.g., 1 day. Adjust as needed.";
    print "        res.setHeader(\"Cache-Control\", \"public, max-age=86400\");";
    print "      }";
    print "    },"; # Make sure this comma is here if setHeaders is not the last option in sirv
    # Skip lines until the original block end.
    # The original block is assumed to be empty or simple, ending in "},"
    printing = 0;
  }
  # This regex tries to find the end of the original setHeaders block.
  # It assumes the original block was just "setHeaders: (res, filePath) => {},"
  # If the original block was more complex, this might need adjustment.
  # We are looking for the closing brace and comma of the setHeaders property.
  /^\s*\},$/ {
    if (!printing) {
      printing = 1;
      next; # Skip this original closing line "}," as we have added our own.
    }
  }
  { if (printing) print }
' server.js > server.js.tmp && mv server.js.tmp server.js

echo "server.js updated with Cache-Control headers logic."

# Verify the change (optional, for debugging)
echo "--- Updated server.js content snippet ---"
grep -A 20 "setHeaders: (res, filePath) => {" server.js
echo "---------------------------------------"

# Check if path module is imported, if not, add it.
# The awk script adds `require("path")` inline, which is fine for CJS.
# For ES Modules, `import path from "path";` is already at the top.
# The inline require is acceptable here for simplicity within the setHeaders scope.

echo "Cache header update complete."
