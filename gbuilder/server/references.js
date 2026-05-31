import { join } from "path";
import { readFile } from "./file-io.js";
import { parseType } from "./type-parser.js";

/**
 * Find all references to a specific enum value across all tables.
 * @param {string} projectDir
 * @param {string} enumName
 * @param {string} enumValue
 * @returns {Array<{table: string, row: string, column: string}>}
 */
export function findEnumReferences(projectDir, enumName, enumValue) {
    const project = readFile(join(projectDir, "project.json"));
    if (!project) return [];
    const dataDir = join(projectDir, project.dataDir || "./data");
    const refs = [];

    for (const [tableName, cfg] of Object.entries(project.tables)) {
        const rows = readFile(join(dataDir, cfg.file)) || [];
        for (const col of cfg.columns) {
            const parsed = parseType(col.type);
            const matches = (val) => {
                if (parsed.kind === "enum" && parsed.name === enumName && val === enumValue) return true;
                if (parsed.kind === "array" && parsed.element.kind === "enum" && parsed.element.name === enumName && Array.isArray(val) && val.includes(enumValue)) return true;
                return false;
            };
            for (const row of rows) {
                if (matches(row[col.name])) {
                    refs.push({ table: tableName, row: String(row[cfg.primaryKey]), column: col.name });
                }
            }
        }
    }
    return refs;
}

/**
 * Find all references to a specific FK target row across all tables.
 * @param {string} projectDir
 * @param {string} targetTable
 * @param {string} targetId
 * @returns {Array<{table: string, row: string, column: string}>}
 */
export function findFKReferences(projectDir, targetTable, targetId) {
    const project = readFile(join(projectDir, "project.json"));
    if (!project) return [];
    const dataDir = join(projectDir, project.dataDir || "./data");
    const refs = [];

    for (const [tableName, cfg] of Object.entries(project.tables)) {
        const rows = readFile(join(dataDir, cfg.file)) || [];
        for (const col of cfg.columns) {
            const parsed = parseType(col.type);
            const matches = (val) => {
                if (parsed.kind === "fk" && parsed.target === targetTable && String(val) === targetId) return true;
                if (parsed.kind === "array" && parsed.element.kind === "fk" && parsed.element.target === targetTable && Array.isArray(val) && val.map(String).includes(targetId)) return true;
                if (parsed.kind === "map" && parsed.key.kind === "fk" && parsed.key.target === targetTable && typeof val === "object" && val !== null && Object.keys(val).includes(targetId)) return true;
                if (parsed.kind === "array" && parsed.element.kind === "map" && parsed.element.key.kind === "fk" && parsed.element.key.target === targetTable && Array.isArray(val)) {
                    for (const pool of val) {
                        if (typeof pool === "object" && pool !== null && Object.keys(pool).includes(targetId)) return true;
                    }
                }
                return false;
            };
            for (const row of rows) {
                if (matches(row[col.name])) {
                    refs.push({ table: tableName, row: String(row[cfg.primaryKey]), column: col.name });
                }
            }
        }
    }
    return refs;
}
