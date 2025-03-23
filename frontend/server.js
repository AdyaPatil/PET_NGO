import express from "express";
import path from "path";
import { fileURLToPath } from "url";
// import port from "./config/config.json";

// Define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, "dist")));

// All other routes should serve the index.html (for client-side routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const port = 5000 
const host = "0.0.0.0";
app.listen(port, host, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://0.0.0.0:${port}`);
});
