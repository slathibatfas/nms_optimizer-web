import express from "express";
import expressStaticGzip from "express-static-gzip";
import { fileURLToPath } from "url";
import path from "path";
import mime from "mime";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const targetHost = "nms-optimizer.app";

// Redirect traffic to canonical domain and enforce HTTPS
app.use((req, res, next) => {
	const host = req.get("host");
	const proto = req.get("x-forwarded-proto");

	if (host !== targetHost || proto !== "https") {
		return res.redirect(301, `https://${targetHost}${req.originalUrl}`);
	}
	next();
});

// Serve pre-compressed static files (Brotli + Gzip)
app.use(
	"/",
	expressStaticGzip(path.join(__dirname, "dist"), {
		enableBrotli: true,
		orderPreference: ["br", "gz"],
		setHeaders: (res, filePath) => {
			// Set accurate Content-Type
			const type = mime.getType(filePath.replace(/\.br$|\.gz$/, ""));
			if (type) {
				res.setHeader("Content-Type", type);
			}

			// Set encoding
			if (filePath.endsWith(".br")) {
				res.setHeader("Content-Encoding", "br");
			} else if (filePath.endsWith(".gz")) {
				res.setHeader("Content-Encoding", "gzip");
			}

			// Set caching headers for hashed assets
			if (/\.[a-f0-9]{8,}\.(js|css|woff2?|ttf|svg|png|jpg|webp|json|map)$/.test(filePath)) {
				res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
			}

			res.setHeader("Vary", "Accept-Encoding");
		},
	})
);

// Catch-all route to serve index.html for SPA routing
app.get("/*splat", async (req, res) => {
	res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
