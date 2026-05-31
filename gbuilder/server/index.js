import app from "./api.js";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

if (!process.env.GBUILDER_PROJECT) {
    process.env.GBUILDER_PROJECT = join(__dirname, "..", "example");
}

const PORT = process.env.GBUILDER_PORT || 3001;
app.listen(PORT, () => {
    console.log(`gbuilder server running on http://localhost:${PORT}`);
    console.log(`project: ${process.env.GBUILDER_PROJECT}`);
});
