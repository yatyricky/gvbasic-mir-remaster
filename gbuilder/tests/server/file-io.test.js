import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { readFile, writeFile, readJsonDir } from "../../server/file-io.js";
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from "fs";
import { join } from "path";

const TMP = join(import.meta.dirname, "__tmp_fileio");

beforeEach(() => {
    if (existsSync(TMP)) rmSync(TMP, { recursive: true });
    mkdirSync(TMP, { recursive: true });
});

afterEach(() => {
    if (existsSync(TMP)) rmSync(TMP, { recursive: true });
});

describe("readFile", () => {
    it("reads a JSON file and returns parsed content", () => {
        const data = [{ id: "a", name: "Alpha" }];
        writeFileSync(join(TMP, "test.json"), JSON.stringify(data));
        const result = readFile(join(TMP, "test.json"));
        expect(result).toEqual(data);
    });

    it("returns null if file does not exist", () => {
        const result = readFile(join(TMP, "nonexistent.json"));
        expect(result).toBeNull();
    });
});

describe("writeFile", () => {
    it("writes JSON data to file", () => {
        const data = [{ id: "b", name: "Beta" }];
        writeFile(join(TMP, "out.json"), data);
        const raw = JSON.parse(
            readFileSync(join(TMP, "out.json"), "utf-8")
        );
        expect(raw).toEqual(data);
    });
});

describe("readJsonDir", () => {
    it("lists .json files in a directory", () => {
        writeFileSync(join(TMP, "A.json"), "[]");
        writeFileSync(join(TMP, "B.json"), "[]");
        writeFileSync(join(TMP, "ignore.txt"), "nope");
        const files = readJsonDir(TMP);
        expect(files.sort()).toEqual(["A.json", "B.json"]);
    });

    it("returns empty array for empty directory", () => {
        const files = readJsonDir(TMP);
        expect(files).toEqual([]);
    });
});
