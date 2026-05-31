import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from "fs";
import { join } from "path";

const TMP = join(import.meta.dirname, "__tmp_schema");
const PROJECT_DIR = join(TMP, "my-project");

let app;

beforeAll(async () => {
    process.env.GBUILDER_PROJECT = PROJECT_DIR;
    const mod = await import("../../server/api.js");
    app = mod.default;
});

beforeEach(() => {
    if (existsSync(TMP)) rmSync(TMP, { recursive: true });
    mkdirSync(join(PROJECT_DIR, "data"), { recursive: true });
});

afterAll(() => {
    if (existsSync(TMP)) rmSync(TMP, { recursive: true });
    delete process.env.GBUILDER_PROJECT;
});

function writeProject(config) {
    writeFileSync(join(PROJECT_DIR, "project.json"), JSON.stringify(config, null, 2));
}

function readProject() {
    return JSON.parse(readFileSync(join(PROJECT_DIR, "project.json"), "utf-8"));
}

const EMPTY_PROJECT = { name: "Test", dataDir: "./data", tables: {}, enums: {} };

describe("POST /api/project/create", () => {
    it("creates a new project directory with project.json", async () => {
        const res = await request(app)
            .post("/api/project/create")
            .send({ path: TMP, name: "new-project" });
        expect(res.status).toBe(200);
        expect(res.body.name).toBe("new-project");
        expect(existsSync(join(TMP, "new-project", "project.json"))).toBe(true);
        expect(existsSync(join(TMP, "new-project", "data"))).toBe(true);
    });
});

describe("POST /api/project/open", () => {
    it("opens an existing project", async () => {
        writeProject({ ...EMPTY_PROJECT, name: "Opened" });
        const res = await request(app)
            .post("/api/project/open")
            .send({ path: PROJECT_DIR });
        expect(res.status).toBe(200);
        expect(res.body.name).toBe("Opened");
    });

    it("returns 404 if no project.json", async () => {
        const res = await request(app)
            .post("/api/project/open")
            .send({ path: join(TMP, "nonexistent") });
        expect(res.status).toBe(404);
    });
});

describe("PUT /api/schema", () => {
    it("saves the full project config", async () => {
        writeProject(EMPTY_PROJECT);
        const updated = { ...EMPTY_PROJECT, name: "Updated" };
        const res = await request(app).put("/api/schema").send(updated);
        expect(res.status).toBe(200);
        expect(readProject().name).toBe("Updated");
    });
});

describe("POST /api/schema/tables", () => {
    it("adds a new table", async () => {
        writeProject(EMPTY_PROJECT);
        const res = await request(app)
            .post("/api/schema/tables")
            .send({ name: "Hero", columns: [{ name: "id", type: "string" }] });
        expect(res.status).toBe(201);
        expect(res.body.file).toBe("Hero.json");
        const p = readProject();
        expect(p.tables.Hero).toBeDefined();
        expect(existsSync(join(PROJECT_DIR, "data", "Hero.json"))).toBe(true);
    });

    it("returns 409 for duplicate table", async () => {
        writeProject({ ...EMPTY_PROJECT, tables: { Hero: { file: "Hero.json", primaryKey: "id", displayField: "name", columns: [] } } });
        const res = await request(app)
            .post("/api/schema/tables")
            .send({ name: "Hero" });
        expect(res.status).toBe(409);
    });
});

describe("PUT /api/schema/tables/:name", () => {
    it("updates table definition", async () => {
        writeProject({ ...EMPTY_PROJECT, tables: { Hero: { file: "Hero.json", primaryKey: "id", displayField: "name", columns: [] } } });
        const res = await request(app)
            .put("/api/schema/tables/Hero")
            .send({ columns: [{ name: "id", type: "string" }, { name: "name", type: "string" }] });
        expect(res.status).toBe(200);
        expect(readProject().tables.Hero.columns).toHaveLength(2);
    });
});

describe("DELETE /api/schema/tables/:name", () => {
    it("removes a table", async () => {
        writeProject({ ...EMPTY_PROJECT, tables: { Hero: { file: "Hero.json", primaryKey: "id", displayField: "name", columns: [] } } });
        const res = await request(app).delete("/api/schema/tables/Hero");
        expect(res.status).toBe(200);
        expect(readProject().tables.Hero).toBeUndefined();
    });
});

describe("Enum CRUD", () => {
    it("creates, updates, and deletes enums", async () => {
        writeProject(EMPTY_PROJECT);

        // Create
        let res = await request(app).post("/api/schema/enums").send({ name: "Color", values: ["red", "blue"] });
        expect(res.status).toBe(201);
        expect(readProject().enums.Color).toEqual(["red", "blue"]);

        // Update
        res = await request(app).put("/api/schema/enums/Color").send({ values: ["red", "green", "blue"] });
        expect(res.status).toBe(200);
        expect(readProject().enums.Color).toEqual(["red", "green", "blue"]);

        // Delete
        res = await request(app).delete("/api/schema/enums/Color");
        expect(res.status).toBe(200);
        expect(readProject().enums.Color).toBeUndefined();
    });
});
