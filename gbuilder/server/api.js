import express from "express";
import { join, resolve, basename } from "path";
import { mkdirSync, existsSync, readdirSync, renameSync } from "fs";
import { execSync } from "child_process";
import { readFile, writeFile } from "./file-io.js";
import { FKResolver } from "./fk-resolver.js";
import { validateProject } from "./validate.js";
import { findEnumReferences, findFKReferences } from "./references.js";
import { loadConfig, addRecentWorkspace, removeRecentWorkspace } from "./app-config.js";

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
    res.json({ ...project, name: basename(getProjectDir()), _path: getProjectDir() });
});

// GET /api/config
app.get("/api/config", (req, res) => {
    res.json(loadConfig());
});

// GET /api/references/enum/:enumName - find ALL references to an enum (all values)
app.get("/api/references/enum/:enumName", (req, res) => {
    const dir = getProjectDir();
    if (!dir) return res.status(400).json({ error: "No project loaded" });
    // Check all values of this enum across all tables
    const project = readFile(join(dir, "project.json"));
    if (!project) return res.status(400).json({ error: "No project" });
    const enumDef = project.enums?.[req.params.enumName];
    if (!enumDef) return res.json([]);
    const values = Array.isArray(enumDef) ? enumDef : Object.keys(enumDef);
    const allRefs = [];
    for (const val of values) {
        const refs = findEnumReferences(dir, req.params.enumName, val);
        for (const r of refs) allRefs.push({ ...r, enumValue: val });
    }
    res.json(allRefs);
});

// GET /api/references/fk/:table/:id - find references to a FK target row
app.get("/api/references/fk/:table/:id", (req, res) => {
    const dir = getProjectDir();
    if (!dir) return res.status(400).json({ error: "No project loaded" });
    const refs = findFKReferences(dir, req.params.table, req.params.id);
    res.json(refs);
});

// GET /api/pick-folder - open native folder picker dialog
app.get("/api/pick-folder", (req, res) => {
    try {
        const ps = `Add-Type -AssemblyName System.Windows.Forms; $d = New-Object System.Windows.Forms.FolderBrowserDialog; $d.ShowNewFolderButton = $false; if ($d.ShowDialog() -eq 'OK') { $d.SelectedPath } else { '' }`;
        const result = execSync(`powershell -NoProfile -Command "${ps}"`, { encoding: "utf-8", timeout: 60000 }).trim();
        if (result) {
            res.json({ path: result });
        } else {
            res.json({ path: null });
        }
    } catch (e) {
        res.json({ path: null });
    }
});

// DELETE /api/config/recent - remove a recent workspace
app.delete("/api/config/recent", (req, res) => {
    const { path } = req.body;
    if (!path) return res.status(400).json({ error: "Missing path" });
    removeRecentWorkspace(path);
    res.json({ ok: true });
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
    addRecentWorkspace(path);
    rebuildFKCache();
    res.json({ ...project, _path: path });
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
    addRecentWorkspace(projectDir);
    res.json({ ...project, _path: projectDir });
});

// ===== Schema Management =====

// PUT /api/schema { project }
app.put("/api/schema", (req, res) => {
    const dir = getProjectDir();
    if (!dir) return res.status(400).json({ error: "No project loaded" });
    // Auto-backup before any schema change
    const current = readFile(join(dir, "project.json"));
    if (current) {
        const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
        writeFile(join(dir, `project.backup.${ts}.json`), current);
    }
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

// PATCH /api/schema/tables/:name/rename { newName }
app.patch("/api/schema/tables/:name/rename", (req, res) => {
    const project = getProject();
    if (!project) return res.status(400).json({ error: "No project loaded" });
    const oldName = req.params.name;
    const { newName } = req.body;
    if (!newName || !newName.trim()) return res.status(400).json({ error: "Missing new name" });
    if (!project.tables[oldName]) return res.status(404).json({ error: "Table not found" });
    if (project.tables[newName]) return res.status(409).json({ error: "Table name already exists" });

    // Rename data file
    const dataDir = getDataDir();
    const oldFile = join(dataDir, `${oldName}.json`);
    const newFile = join(dataDir, `${newName}.json`);
    if (existsSync(oldFile)) renameSync(oldFile, newFile);

    // Move table entry to new key, update file reference
    const cfg = project.tables[oldName];
    cfg.file = `${newName}.json`;
    delete project.tables[oldName];
    project.tables[newName] = cfg;

    // Update FK references in other tables
    for (const [, tblCfg] of Object.entries(project.tables)) {
        for (const col of tblCfg.columns) {
            col.type = col.type.replace(new RegExp(`FK:${oldName}(?=[\\]>,\\s]|$)`, "g"), `FK:${newName}`);
        }
    }

    writeFile(join(getProjectDir(), "project.json"), project);
    rebuildFKCache();
    res.json(project);
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

// GET /api/image - serve image files, tries .jpg then .png
app.get("/api/image", (req, res) => {
    const relPath = req.query.path;
    if (!relPath) return res.status(400).json({ error: "Missing path" });
    const dir = getProjectDir();
    if (!dir) return res.status(400).json({ error: "No project loaded" });

    const candidates = [relPath, relPath + ".jpg", relPath + ".png"];
    for (const candidate of candidates) {
        const absPath = resolve(dir, candidate);
        if (existsSync(absPath)) {
            return res.sendFile(absPath);
        }
    }
    return res.status(404).json({ error: "File not found" });
});

// GET /api/images?dir=relative/path - list image files in a directory
app.get("/api/images", (req, res) => {
    const relDir = req.query.dir;
    if (!relDir) return res.status(400).json({ error: "Missing dir" });
    const dir = getProjectDir();
    if (!dir) return res.status(400).json({ error: "No project loaded" });
    const absDir = resolve(dir, relDir);
    if (!existsSync(absDir)) return res.json([]);
    try {
        const files = readdirSync(absDir)
            .filter(f => /\.(jpg|png)$/i.test(f))
            .map(f => f.replace(/\.(jpg|png)$/i, ""));
        res.json(files);
    } catch {
        res.json([]);
    }
});

// Rebuild cache on startup
rebuildFKCache();

export default app;
