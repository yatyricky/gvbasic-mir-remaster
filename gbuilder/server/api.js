import express from "express";
import { join } from "path";
import { mkdirSync, existsSync } from "fs";
import { readFile, writeFile } from "./file-io.js";
import { FKResolver } from "./fk-resolver.js";
import { validateProject } from "./validate.js";

const app = express();
app.use(express.json());

const fkResolver = new FKResolver();

function getProjectDir() {
    return process.env.GBUILDER_PROJECT;
}

function getProject() {
    const dir = getProjectDir();
    if (!dir) return null;
    return readFile(join(dir, "project.json"));
}

function getDataDir() {
    const project = getProject();
    if (!project) return null;
    return join(getProjectDir(), project.dataDir || "./data");
}

function rebuildFKCache() {
    const project = getProject();
    if (!project) return;
    const dataDir = getDataDir();
    for (const [name, cfg] of Object.entries(project.tables)) {
        const rows = readFile(join(dataDir, cfg.file)) || [];
        fkResolver.loadTable(name, cfg.primaryKey, cfg.displayField, rows);
    }
}

// GET /api/project
app.get("/api/project", (req, res) => {
    const project = getProject();
    if (!project) return res.status(400).json({ error: "No project loaded" });
    res.json(project);
});

// GET /api/tables
app.get("/api/tables", (req, res) => {
    const project = getProject();
    if (!project) return res.status(400).json({ error: "No project loaded" });
    const dataDir = getDataDir();
    const tables = Object.entries(project.tables).map(([name, cfg]) => {
        const rows = readFile(join(dataDir, cfg.file)) || [];
        return { name, rowCount: rows.length };
    });
    res.json(tables);
});

// GET /api/tables/:name
app.get("/api/tables/:name", (req, res) => {
    const project = getProject();
    if (!project) return res.status(400).json({ error: "No project loaded" });
    const cfg = project.tables[req.params.name];
    if (!cfg) return res.status(404).json({ error: "Table not found" });
    const rows = readFile(join(getDataDir(), cfg.file)) || [];
    res.json({ columns: cfg.columns, rows });
});

// PATCH /api/tables/:name/:id
app.patch("/api/tables/:name/:id", (req, res) => {
    const project = getProject();
    if (!project) return res.status(400).json({ error: "No project loaded" });
    const cfg = project.tables[req.params.name];
    if (!cfg) return res.status(404).json({ error: "Table not found" });
    const filePath = join(getDataDir(), cfg.file);
    const rows = readFile(filePath) || [];
    const idx = rows.findIndex((r) => r[cfg.primaryKey] === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Row not found" });
    rows[idx] = req.body.row;
    writeFile(filePath, rows);
    res.json({ ok: true });
});

// POST /api/tables/:name
app.post("/api/tables/:name", (req, res) => {
    const project = getProject();
    if (!project) return res.status(400).json({ error: "No project loaded" });
    const cfg = project.tables[req.params.name];
    if (!cfg) return res.status(404).json({ error: "Table not found" });
    const filePath = join(getDataDir(), cfg.file);
    const rows = readFile(filePath) || [];
    rows.push(req.body.row);
    writeFile(filePath, rows);
    res.status(201).json({ ok: true });
});

// DELETE /api/tables/:name/:id
app.delete("/api/tables/:name/:id", (req, res) => {
    const project = getProject();
    if (!project) return res.status(400).json({ error: "No project loaded" });
    const cfg = project.tables[req.params.name];
    if (!cfg) return res.status(404).json({ error: "Table not found" });
    const filePath = join(getDataDir(), cfg.file);
    let rows = readFile(filePath) || [];
    rows = rows.filter((r) => r[cfg.primaryKey] !== req.params.id);
    writeFile(filePath, rows);
    res.json({ ok: true });
});

// ===== Project Management =====

// POST /api/project/open { path }
app.post("/api/project/open", (req, res) => {
    const { path } = req.body;
    if (!path) return res.status(400).json({ error: "Missing path" });
    const projectPath = join(path, "project.json");
    const project = readFile(projectPath);
    if (!project) return res.status(404).json({ error: "No project.json found" });
    process.env.GBUILDER_PROJECT = path;
    rebuildFKCache();
    res.json(project);
});

// POST /api/project/create { path, name }
app.post("/api/project/create", (req, res) => {
    const { path, name } = req.body;
    if (!path || !name) return res.status(400).json({ error: "Missing path or name" });
    const projectDir = join(path, name);
    if (!existsSync(projectDir)) mkdirSync(projectDir, { recursive: true });
    const dataDir = join(projectDir, "data");
    if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
    const project = { name, dataDir: "./data", tables: {}, enums: {} };
    writeFile(join(projectDir, "project.json"), project);
    process.env.GBUILDER_PROJECT = projectDir;
    res.json(project);
});

// ===== Schema Management =====

// PUT /api/schema { project }
app.put("/api/schema", (req, res) => {
    const dir = getProjectDir();
    if (!dir) return res.status(400).json({ error: "No project loaded" });
    writeFile(join(dir, "project.json"), req.body);
    rebuildFKCache();
    res.json({ ok: true });
});

// POST /api/schema/tables { name, columns }
app.post("/api/schema/tables", (req, res) => {
    const project = getProject();
    if (!project) return res.status(400).json({ error: "No project loaded" });
    const { name, columns } = req.body;
    if (!name) return res.status(400).json({ error: "Missing table name" });
    if (project.tables[name]) return res.status(409).json({ error: "Table already exists" });
    project.tables[name] = {
        file: `${name}.json`,
        primaryKey: "id",
        displayField: "name",
        columns: columns || [],
    };
    writeFile(join(getProjectDir(), "project.json"), project);
    // Create empty data file
    writeFile(join(getDataDir(), `${name}.json`), []);
    res.status(201).json(project.tables[name]);
});

// PUT /api/schema/tables/:name { ...updates }
app.put("/api/schema/tables/:name", (req, res) => {
    const project = getProject();
    if (!project) return res.status(400).json({ error: "No project loaded" });
    const cfg = project.tables[req.params.name];
    if (!cfg) return res.status(404).json({ error: "Table not found" });
    Object.assign(cfg, req.body);
    writeFile(join(getProjectDir(), "project.json"), project);
    res.json(cfg);
});

// DELETE /api/schema/tables/:name
app.delete("/api/schema/tables/:name", (req, res) => {
    const project = getProject();
    if (!project) return res.status(400).json({ error: "No project loaded" });
    if (!project.tables[req.params.name]) return res.status(404).json({ error: "Table not found" });
    delete project.tables[req.params.name];
    writeFile(join(getProjectDir(), "project.json"), project);
    res.json({ ok: true });
});

// POST /api/schema/enums { name, values }
app.post("/api/schema/enums", (req, res) => {
    const project = getProject();
    if (!project) return res.status(400).json({ error: "No project loaded" });
    const { name, values } = req.body;
    if (!name) return res.status(400).json({ error: "Missing enum name" });
    if (project.enums[name]) return res.status(409).json({ error: "Enum already exists" });
    project.enums[name] = values || [];
    writeFile(join(getProjectDir(), "project.json"), project);
    res.status(201).json({ name, values: project.enums[name] });
});

// PUT /api/schema/enums/:name { values }
app.put("/api/schema/enums/:name", (req, res) => {
    const project = getProject();
    if (!project) return res.status(400).json({ error: "No project loaded" });
    if (!project.enums[req.params.name]) return res.status(404).json({ error: "Enum not found" });
    project.enums[req.params.name] = req.body.values;
    writeFile(join(getProjectDir(), "project.json"), project);
    res.json({ name: req.params.name, values: req.body.values });
});

// DELETE /api/schema/enums/:name
app.delete("/api/schema/enums/:name", (req, res) => {
    const project = getProject();
    if (!project) return res.status(400).json({ error: "No project loaded" });
    if (!project.enums[req.params.name]) return res.status(404).json({ error: "Enum not found" });
    delete project.enums[req.params.name];
    writeFile(join(getProjectDir(), "project.json"), project);
    res.json({ ok: true });
});

// POST /api/resolve-fk  { table, ids }
app.post("/api/resolve-fk", (req, res) => {
    rebuildFKCache();
    const { table, ids } = req.body;
    if (!table || !ids) return res.status(400).json({ error: "Missing table or ids" });
    res.json(fkResolver.resolveBatch(table, ids));
});

// GET /api/export/:name
app.get("/api/export/:name", (req, res) => {
    const project = getProject();
    if (!project) return res.status(400).json({ error: "No project loaded" });
    const cfg = project.tables[req.params.name];
    if (!cfg) return res.status(404).json({ error: "Table not found" });
    const rows = readFile(join(getDataDir(), cfg.file)) || [];
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="${req.params.name}.json"`);
    res.json(rows);
});

// GET /api/validate
app.get("/api/validate", (req, res) => {
    const dir = getProjectDir();
    if (!dir) return res.status(400).json({ error: "No project loaded" });
    const errors = validateProject(dir);
    res.json(errors);
});

// GET /api/fk/search/:table?q=...
app.get("/api/fk/search/:table", (req, res) => {
    rebuildFKCache();
    const q = req.query.q || "";
    const results = fkResolver.search(req.params.table, q);
    res.json(results);
});

// Rebuild cache on startup
rebuildFKCache();

export default app;
