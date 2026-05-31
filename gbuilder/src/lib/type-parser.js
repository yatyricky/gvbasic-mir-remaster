/**
 * Parse a type string into a structured type descriptor.
 * Shared between server and client.
 *
 * @param {string} typeStr
 * @returns {object} type descriptor
 */
export function parseType(typeStr) {
    const s = typeStr.trim();

    if (s.endsWith("[]")) {
        const inner = s.slice(0, -2);
        return { kind: "array", element: parseType(inner) };
    }

    if (s.startsWith("Map<")) {
        const inner = s.slice(4, -1);
        const { key, value } = splitMapKV(inner);
        return { kind: "map", key: parseType(key), value: parseType(value) };
    }

    if (s.startsWith("Enum:")) return { kind: "enum", name: s.slice(5) };
    if (s.startsWith("FK:")) return { kind: "fk", target: s.slice(3) };

    if (s === "string" || s === "number" || s === "boolean") {
        return { kind: "primitive", base: s };
    }

    return { kind: "primitive", base: s };
}

function splitMapKV(inner) {
    let depth = 0;
    for (let i = 0; i < inner.length; i++) {
        if (inner[i] === "<") depth++;
        if (inner[i] === ">") depth--;
        if (inner[i] === "," && depth === 0) {
            return { key: inner.slice(0, i).trim(), value: inner.slice(i + 1).trim() };
        }
    }
    throw new Error(`Invalid Map type: Map<${inner}>`);
}
