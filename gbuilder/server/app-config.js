import { join } from "path";
import { readFile, writeFile } from "./file-io.js";
import { mkdirSync, existsSync } from "fs";

function getConfigPath() {
    const home = process.env.USERPROFILE || process.env.HOME || "";
    return join(home, ".gbuilder", "config.json");
}

function ensureDir() {
    const dir = join(getConfigPath(), "..");
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

/** @returns {{ recentWorkspaces: string[] }} */
export function loadConfig() {
    const config = readFile(getConfigPath());
    if (!config) return { recentWorkspaces: [] };
    return {
        recentWorkspaces: Array.isArray(config.recentWorkspaces) ? config.recentWorkspaces : [],
    };
}

export function saveConfig(config) {
    ensureDir();
    writeFile(getConfigPath(), config);
}

export function addRecentWorkspace(path) {
    const config = loadConfig();
    const list = config.recentWorkspaces.filter(p => p !== path);
    list.unshift(path);
    config.recentWorkspaces = list.slice(0, 20); // keep last 20
    saveConfig(config);
}

export function removeRecentWorkspace(path) {
    const config = loadConfig();
    config.recentWorkspaces = config.recentWorkspaces.filter(p => p !== path);
    saveConfig(config);
}
