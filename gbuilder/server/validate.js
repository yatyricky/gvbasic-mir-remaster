import { join } from "path";
import { readFile } from "./file-io.js";
import { parseType } from "./type-parser.js";

/**
 * Validate a project for FK integrity, duplicate keys, and enum values.
 * @param {string} projectDir
 * @returns {Array<{table: string, row: string, column: string, message: string}>}
 */
export function validateProject(projectDir) {
    const project = readFile(join(projectDir, "project.json"));
    if (!project) return [{ table: "", row: "", column: "", message: "No project.json found" }];

    const dataDir = join(projectDir, project.dataDir || "./data");
    const errors = [];

    // Build index of all tables' primary keys
    const pkIndex = new Map(); // tableName -> Set<pk>
    const tableData = new Map(); // tableName -> rows[]

    for (const [name, cfg] of Object.entries(project.tables)) {
        const rows = readFile(join(dataDir, cfg.file)) || [];
        tableData.set(name, rows);

        // Check duplicate PKs
        const seen = new Set();
        for (const row of rows) {
            const pk = String(row[cfg.primaryKey]);
            if (seen.has(pk)) {
                errors.push({
                    table: name,
                    row: pk,
                    column: cfg.primaryKey,
                    message: `Duplicate primary key: ${pk}`,
                });
            }
            seen.add(pk);
        }
        pkIndex.set(name, seen);
    }

    // Validate FK references and enum values
    for (const [name, cfg] of Object.entries(project.tables)) {
        const rows = tableData.get(name) || [];
        for (const col of cfg.columns) {
            const parsed = parseType(col.type);

            for (const row of rows) {
                const val = row[col.name];
                if (val == null || val === "") continue;

                // Single FK
                if (parsed.kind === "fk") {
                    const targetPKs = pkIndex.get(parsed.target);
                    if (targetPKs && !targetPKs.has(String(val))) {
                        errors.push({
                            table: name,
                            row: String(row[cfg.primaryKey]),
                            column: col.name,
                            message: `FK "${val}" not found in ${parsed.target}`,
                        });
                    }
                }

                // FK array
                if (parsed.kind === "array" && parsed.element.kind === "fk" && Array.isArray(val)) {
                    const targetPKs = pkIndex.get(parsed.element.target);
                    for (const id of val) {
                        if (targetPKs && !targetPKs.has(String(id))) {
                            errors.push({
                                table: name,
                                row: String(row[cfg.primaryKey]),
                                column: col.name,
                                message: `FK "${id}" not found in ${parsed.element.target}`,
                            });
                        }
                    }
                }

                // Map with FK keys
                if (parsed.kind === "map" && parsed.key.kind === "fk" && typeof val === "object" && val !== null) {
                    const targetPKs = pkIndex.get(parsed.key.target);
                    for (const key of Object.keys(val)) {
                        if (targetPKs && !targetPKs.has(key)) {
                            errors.push({
                                table: name,
                                row: String(row[cfg.primaryKey]),
                                column: col.name,
                                message: `FK key "${key}" not found in ${parsed.key.target}`,
                            });
                        }
                    }
                }

                // Array of maps with FK keys
                if (parsed.kind === "array" && parsed.element.kind === "map" && parsed.element.key.kind === "fk" && Array.isArray(val)) {
                    const targetPKs = pkIndex.get(parsed.element.key.target);
                    for (const pool of val) {
                        if (typeof pool === "object" && pool !== null) {
                            for (const key of Object.keys(pool)) {
                                if (targetPKs && !targetPKs.has(key)) {
                                    errors.push({
                                        table: name,
                                        row: String(row[cfg.primaryKey]),
                                        column: col.name,
                                        message: `FK key "${key}" not found in ${parsed.element.key.target}`,
                                    });
                                }
                            }
                        }
                    }
                }

                // Enum validation
                if (parsed.kind === "enum" && project.enums[parsed.name]) {
                    if (!project.enums[parsed.name].includes(String(val))) {
                        errors.push({
                            table: name,
                            row: String(row[cfg.primaryKey]),
                            column: col.name,
                            message: `Invalid enum value "${val}" for ${parsed.name}`,
                        });
                    }
                }

                // Enum array validation
                if (parsed.kind === "array" && parsed.element.kind === "enum" && Array.isArray(val)) {
                    const valid = project.enums[parsed.element.name] || [];
                    for (const v of val) {
                        if (!valid.includes(String(v))) {
                            errors.push({
                                table: name,
                                row: String(row[cfg.primaryKey]),
                                column: col.name,
                                message: `Invalid enum value "${v}" for ${parsed.element.name}`,
                            });
                        }
                    }
                }
            }
        }
    }

    return errors;
}
