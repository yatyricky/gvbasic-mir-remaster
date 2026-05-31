import { describe, it, expect } from "vitest";
import { parseType } from "../../server/type-parser.js";

describe("parseType", () => {
    it("parses primitive types", () => {
        expect(parseType("string")).toEqual({ kind: "primitive", base: "string" });
        expect(parseType("number")).toEqual({ kind: "primitive", base: "number" });
        expect(parseType("boolean")).toEqual({ kind: "primitive", base: "boolean" });
    });

    it("parses Enum type", () => {
        expect(parseType("Enum:ItemType")).toEqual({ kind: "enum", name: "ItemType" });
    });

    it("parses FK type", () => {
        expect(parseType("FK:Unit")).toEqual({ kind: "fk", target: "Unit" });
    });

    it("parses primitive array", () => {
        expect(parseType("string[]")).toEqual({ kind: "array", element: { kind: "primitive", base: "string" } });
    });

    it("parses Enum array", () => {
        expect(parseType("Enum:SkillTag[]")).toEqual({ kind: "array", element: { kind: "enum", name: "SkillTag" } });
    });

    it("parses FK array", () => {
        expect(parseType("FK:Unit[]")).toEqual({ kind: "array", element: { kind: "fk", target: "Unit" } });
    });

    it("parses Map type", () => {
        expect(parseType("Map<string, number>")).toEqual({
            kind: "map",
            key: { kind: "primitive", base: "string" },
            value: { kind: "primitive", base: "number" },
        });
    });

    it("parses Map with FK key", () => {
        expect(parseType("Map<FK:Affix, number>")).toEqual({
            kind: "map",
            key: { kind: "fk", target: "Affix" },
            value: { kind: "primitive", base: "number" },
        });
    });

    it("parses Map with Enum key", () => {
        expect(parseType("Map<Enum:StatType, number>")).toEqual({
            kind: "map",
            key: { kind: "enum", name: "StatType" },
            value: { kind: "primitive", base: "number" },
        });
    });

    it("parses array of Map", () => {
        expect(parseType("Map<FK:Affix, number>[]")).toEqual({
            kind: "array",
            element: {
                kind: "map",
                key: { kind: "fk", target: "Affix" },
                value: { kind: "primitive", base: "number" },
            },
        });
    });

    it("parses Map<FK:Skill, number>", () => {
        expect(parseType("Map<FK:Skill, number>")).toEqual({
            kind: "map",
            key: { kind: "fk", target: "Skill" },
            value: { kind: "primitive", base: "number" },
        });
    });
});
