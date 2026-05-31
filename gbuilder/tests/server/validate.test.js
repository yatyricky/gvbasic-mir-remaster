import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdirSync, writeFileSync, rmSync, existsSync } from "fs";
import { join } from "path";

const TMP = join(import.meta.dirname, "__tmp_validate");

beforeEach(() => {
    if (existsSync(TMP)) rmSync(TMP, { recursive: true });
    mkdirSync(join(TMP, "data"), { recursive: true });
});

afterEach(() => {
    if (existsSync(TMP)) rmSync(TMP, { recursive: true });
});

async function loadValidator() {
    const mod = await import("../../server/validate.js");
    return mod;
}

function writeProject(config) {
    writeFileSync(join(TMP, "project.json"), JSON.stringify(config, null, 2));
}

function writeTable(name, rows) {
    writeFileSync(join(TMP, "data", name + ".json"), JSON.stringify(rows, null, 2));
}

describe("validate", () => {
    it("detects dangling FK references", async () => {
        const project = {
            name: "Test",
            dataDir: "./data",
            tables: {
                Unit: {
                    file: "Unit.json", primaryKey: "id", displayField: "name",
                    columns: [
                        { name: "id", type: "string", meta: ["Index"] },
                        { name: "name", type: "string" },
                    ],
                },
                Skill: {
                    file: "Skill.json", primaryKey: "id", displayField: "name",
                    columns: [
                        { name: "id", type: "string", meta: ["Index"] },
                        { name: "name", type: "string" },
                        { name: "klass", type: "FK:Unit" },
                    ],
                },
            },
            enums: {},
        };
        writeProject(project);
        writeTable("Unit", [{ id: "warr", name: "Warrior" }]);
        writeTable("Skill", [
            { id: "fblt", name: "Fireball", klass: "mage" }, // mage doesn't exist
            { id: "bbas", name: "Bash", klass: "warr" },      // OK
        ]);

        const { validateProject } = await loadValidator();
        const errors = validateProject(TMP);
        expect(errors).toHaveLength(1);
        expect(errors[0].table).toBe("Skill");
        expect(errors[0].row).toBe("fblt");
        expect(errors[0].column).toBe("klass");
    });

    it("detects duplicate primary keys", async () => {
        const project = {
            name: "Test",
            dataDir: "./data",
            tables: {
                Item: {
                    file: "Item.json", primaryKey: "id", displayField: "name",
                    columns: [
                        { name: "id", type: "string", meta: ["Index"] },
                        { name: "name", type: "string" },
                    ],
                },
            },
            enums: {},
        };
        writeProject(project);
        writeTable("Item", [
            { id: "sword1", name: "Sword A" },
            { id: "sword1", name: "Sword B" }, // duplicate
        ]);

        const { validateProject } = await loadValidator();
        const errors = validateProject(TMP);
        expect(errors).toHaveLength(1);
        expect(errors[0].column).toBe("id");
        expect(errors[0].message).toContain("Duplicate");
    });

    it("detects invalid enum values", async () => {
        const project = {
            name: "Test",
            dataDir: "./data",
            tables: {
                Item: {
                    file: "Item.json", primaryKey: "id", displayField: "name",
                    columns: [
                        { name: "id", type: "string", meta: ["Index"] },
                        { name: "type", type: "Enum:ItemType" },
                    ],
                },
            },
            enums: { ItemType: ["helm", "sword"] },
        };
        writeProject(project);
        writeTable("Item", [
            { id: "i1", type: "helm" },     // OK
            { id: "i2", type: "shield" },    // invalid
        ]);

        const { validateProject } = await loadValidator();
        const errors = validateProject(TMP);
        expect(errors).toHaveLength(1);
        expect(errors[0].row).toBe("i2");
        expect(errors[0].column).toBe("type");
    });

    it("passes for valid data", async () => {
        const project = {
            name: "Test",
            dataDir: "./data",
            tables: {
                Unit: {
                    file: "Unit.json", primaryKey: "id", displayField: "name",
                    columns: [
                        { name: "id", type: "string", meta: ["Index"] },
                        { name: "name", type: "string" },
                    ],
                },
                Skill: {
                    file: "Skill.json", primaryKey: "id", displayField: "name",
                    columns: [
                        { name: "id", type: "string", meta: ["Index"] },
                        { name: "name", type: "string" },
                        { name: "klass", type: "FK:Unit" },
                    ],
                },
            },
            enums: {},
        };
        writeProject(project);
        writeTable("Unit", [{ id: "warr", name: "Warrior" }]);
        writeTable("Skill", [{ id: "bbas", name: "Bash", klass: "warr" }]);

        const { validateProject } = await loadValidator();
        const errors = validateProject(TMP);
        expect(errors).toHaveLength(0);
    });
});
