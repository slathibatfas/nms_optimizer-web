import express from "express";
import { fileURLToPath } from "url";
import path from "path";

// Get the current directory from the module URL
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, "dist")));

// Handle React/Vite history mode (SPA routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Use the PORT environment variable provided by Heroku or fallback to 3000 locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});