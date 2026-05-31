import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";

/**
 * Read and parse a JSON file.
 * @param {string} filePath
 * @returns {any|null} parsed content or null if file doesn't exist
 */
export function readFile(filePath) {
    if (!existsSync(filePath)) return null;
    return JSON.parse(readFileSync(filePath, "utf-8"));
}

/**
 * Write data as JSON to a file.
 * @param {string} filePath
 * @param {any} data
 */
export function writeFile(filePath, data) {
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * List .json files in a directory.
 * @param {string} dirPath
 * @returns {string[]} filenames
 */
export function readJsonDir(dirPath) {
    if (!existsSync(dirPath)) return [];
    return readdirSync(dirPath).filter((f) => f.endsWith(".json"));
}
