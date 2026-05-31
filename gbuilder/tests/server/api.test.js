import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { mkdirSync, writeFileSync, rmSync, existsSync } from "fs";
import { join } from "path";

const TMP = join(import.meta.dirname, "__tmp_api");
const PROJECT_DIR = join(TMP, "my-project");
const DATA_DIR = join(PROJECT_DIR, "data");

let app;

beforeAll(async () => {
    process.env.GBUILDER_PROJECT = PROJECT_DIR;
    const mod = await import("../../server/api.js");
    app = mod.default;
});

beforeEach(() => {
    if (existsSync(TMP)) rmSync(TMP, { recursive: true });
    mkdirSync(DATA_DIR, { recursive: true });
});

afterAll(() => {
    if (existsSync(TMP)) rmSync(TMP, { recursive: true });
    delete process.env.GBUILDER_PROJECT;
});

function writeProject(config) {
    writeFileSync(join(PROJECT_DIR, "project.json"), JSON.stringify(config, null, 2));
}

function writeTable(name, rows) {
    writeFileSync(join(DATA_DIR, name + ".json"), JSON.stringify(rows, null, 2));
}

const SIMPLE_PROJECT = {
    name: "Test Project",
    dataDir: "./data",
    tables: {
        Hero: {
            file: "Hero.json",
            primaryKey: "id",
            displayField: "name",
            columns: [
                { name: "id", type: "string" },
                { name: "name", type: "string" },
                { name: "level", type: "number" },
            ],
        },
        Item: {
            file: "Item.json",
            primaryKey: "id",
            displayField: "name",
            columns: [
                { name: "id", type: "string" },
                { name: "name", type: "string" },
            ],
        },
    },
    enums: {},
};

describe("GET /api/project", () => {
    it("returns 400 when no project is loaded", async () => {
        delete process.env.GBUILDER_PROJECT;
        const res = await request(app).get("/api/project");
        expect(res.status).toBe(400);
        process.env.GBUILDER_PROJECT = PROJECT_DIR;
    });

    it("returns the project.json content", async () => {
        writeProject(SIMPLE_PROJECT);
        const res = await request(app).get("/api/project");
        expect(res.status).toBe(200);
        expect(res.body.name).toBe("Test Project");
        expect(Object.keys(res.body.tables)).toEqual(["Hero", "Item"]);
    });
});

describe("GET /api/tables", () => {
    it("returns table list with row counts", async () => {
        writeProject(SIMPLE_PROJECT);
        writeTable("Hero", [
            { id: "h1", name: "Warrior", level: 1 },
            { id: "h2", name: "Mage", level: 1 },
        ]);
        writeTable("Item", [{ id: "i1", name: "Sword" }]);

        const res = await request(app).get("/api/tables");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([
            { name: "Hero", rowCount: 2 },
            { name: "Item", rowCount: 1 },
        ]);
    });
});

describe("GET /api/tables/:name", () => {
    it("returns table data with columns and rows", async () => {
        writeProject(SIMPLE_PROJECT);
        writeTable("Hero", [{ id: "h1", name: "Warrior", level: 5 }]);

        const res = await request(app).get("/api/tables/Hero");
        expect(res.status).toBe(200);
        expect(res.body.columns).toHaveLength(3);
        expect(res.body.rows).toHaveLength(1);
        expect(res.body.rows[0].name).toBe("Warrior");
    });

    it("returns 404 for unknown table", async () => {
        writeProject(SIMPLE_PROJECT);
        const res = await request(app).get("/api/tables/Unknown");
        expect(res.status).toBe(404);
    });
});

describe("PATCH /api/tables/:name/:id", () => {
    it("updates a row and writes to file", async () => {
        writeProject(SIMPLE_PROJECT);
        writeTable("Hero", [{ id: "h1", name: "Warrior", level: 5 }]);

        const res = await request(app)
            .patch("/api/tables/Hero/h1")
            .send({ row: { id: "h1", name: "Paladin", level: 10 } });
        expect(res.status).toBe(200);

        // Verify file was updated
        const getRes = await request(app).get("/api/tables/Hero");
        expect(getRes.body.rows[0].name).toBe("Paladin");
        expect(getRes.body.rows[0].level).toBe(10);
    });

    it("returns 404 for unknown row", async () => {
        writeProject(SIMPLE_PROJECT);
        writeTable("Hero", []);
        const res = await request(app)
            .patch("/api/tables/Hero/nonexistent")
            .send({ row: { id: "nonexistent", name: "X" } });
        expect(res.status).toBe(404);
    });
});

describe("POST /api/tables/:name", () => {
    it("adds a new row", async () => {
        writeProject(SIMPLE_PROJECT);
        writeTable("Hero", []);

        const res = await request(app)
            .post("/api/tables/Hero")
            .send({ row: { id: "h3", name: "Rogue", level: 3 } });
        expect(res.status).toBe(201);

        const getRes = await request(app).get("/api/tables/Hero");
        expect(getRes.body.rows).toHaveLength(1);
        expect(getRes.body.rows[0].id).toBe("h3");
    });
});

describe("DELETE /api/tables/:name/:id", () => {
    it("deletes a row", async () => {
        writeProject(SIMPLE_PROJECT);
        writeTable("Hero", [
            { id: "h1", name: "Warrior", level: 5 },
            { id: "h2", name: "Mage", level: 3 },
        ]);

        const res = await request(app).delete("/api/tables/Hero/h1");
        expect(res.status).toBe(200);

        const getRes = await request(app).get("/api/tables/Hero");
        expect(getRes.body.rows).toHaveLength(1);
        expect(getRes.body.rows[0].id).toBe("h2");
    });
});

describe("POST /api/resolve-fk", () => {
    it("resolves FK ids to display names", async () => {
        writeProject(SIMPLE_PROJECT);
        writeTable("Hero", [
            { id: "h1", name: "Warrior", level: 5 },
            { id: "h2", name: "Mage", level: 3 },
        ]);

        const res = await request(app)
            .post("/api/resolve-fk")
            .send({ table: "Hero", ids: ["h1", "h2", "h99"] });
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ h1: "Warrior", h2: "Mage" });
    });
});

describe("GET /api/fk/search/:table", () => {
    it("searches by id or display name", async () => {
        writeProject(SIMPLE_PROJECT);
        writeTable("Hero", [
            { id: "h1", name: "Warrior", level: 5 },
            { id: "h2", name: "Mage", level: 3 },
        ]);

        const res = await request(app).get("/api/fk/search/Hero?q=war");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([{ id: "h1", display: "Warrior" }]);
    });
});

describe("GET /api/references/enum/:enumName", () => {
    it("finds all enum references across all values", async () => {
        writeProject({
            ...SIMPLE_PROJECT,
            enums: { HeroClass: ["warrior", "mage"] },
            tables: {
                Hero: {
                    file: "Hero.json", primaryKey: "id", displayField: "name",
                    columns: [
                        { name: "id", type: "string" },
                        { name: "name", type: "string" },
                        { name: "class", type: "Enum:HeroClass" },
                    ],
                },
            },
        });
        writeTable("Hero", [
            { id: "h1", name: "Warrior", class: "warrior" },
            { id: "h2", name: "Mage", class: "mage" },
        ]);

        const res = await request(app).get("/api/references/enum/HeroClass");
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0].table).toBe("Hero");
        expect(res.body[0].enumValue).toBe("warrior");
        expect(res.body[1].enumValue).toBe("mage");
    });

    it("returns empty for unreferenced enum", async () => {
        writeProject({
            ...SIMPLE_PROJECT,
            enums: { HeroClass: ["warrior", "mage"], Unused: ["a", "b"] },
            tables: {
                Hero: {
                    file: "Hero.json", primaryKey: "id", displayField: "name",
                    columns: [
                        { name: "id", type: "string" },
                        { name: "class", type: "Enum:HeroClass" },
                    ],
                },
            },
        });
        writeTable("Hero", [
            { id: "h1", name: "Warrior", class: "warrior" },
        ]);

        const res = await request(app).get("/api/references/enum/Unused");
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(0);
    });

    it("finds enum array references", async () => {
        writeProject({
            ...SIMPLE_PROJECT,
            enums: { Tag: ["fire", "ice", "lightning"] },
            tables: {
                Skill: {
                    file: "Skill.json", primaryKey: "id", displayField: "name",
                    columns: [
                        { name: "id", type: "string" },
                        { name: "tags", type: "Enum:Tag[]" },
                    ],
                },
            },
        });
        writeTable("Skill", [
            { id: "s1", name: "Fireball", tags: ["fire"] },
            { id: "s2", name: "Blizzard", tags: ["ice", "lightning"] },
        ]);

        const res = await request(app).get("/api/references/enum/Tag");
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(3); // fire in s1, ice in s2, lightning in s2
    });
});
