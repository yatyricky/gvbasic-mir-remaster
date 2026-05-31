import { describe, it, expect, beforeEach } from "vitest";
import { FKResolver } from "../../server/fk-resolver.js";

describe("FKResolver", () => {
    let resolver;

    beforeEach(() => {
        resolver = new FKResolver();
        resolver.loadTable("Unit", "id", "name", [
            { id: "warr", name: "战士" },
            { id: "mage", name: "法师" },
            { id: "wlk", name: "道士" },
        ]);
        resolver.loadTable("Stat", "id", "name", [
            { id: "str", name: "力量" },
            { id: "crit", name: "暴击率" },
        ]);
    });

    it("resolves a single FK", () => {
        expect(resolver.resolve("Unit", "warr")).toBe("战士");
        expect(resolver.resolve("Unit", "mage")).toBe("法师");
    });

    it("returns null for unknown id", () => {
        expect(resolver.resolve("Unit", "nonexistent")).toBeNull();
    });

    it("returns null for unknown table", () => {
        expect(resolver.resolve("Unknown", "x")).toBeNull();
    });

    it("resolves a batch of ids", () => {
        const result = resolver.resolveBatch("Unit", ["warr", "mage", "unknown"]);
        expect(result).toEqual({
            warr: "战士",
            mage: "法师",
        });
    });

    it("resolves to a custom display field", () => {
        resolver.loadTable("Item", "id", "description", [
            { id: "sword1", description: "A basic sword" },
        ]);
        expect(resolver.resolve("Item", "sword1")).toBe("A basic sword");
    });

    it("lists all ids in a table", () => {
        const ids = resolver.getIds("Unit");
        expect(ids.sort()).toEqual(["mage", "warr", "wlk"]);
    });
});
