/**
 * Get enum values as an array of { value, label } objects.
 * Strips _label metadata key.
 * @param {string[] | Record<string, string>} enumDef
 * @returns {Array<{value: string, label: string}>}
 */
export function getEnumEntries(enumDef) {
    if (!enumDef) return [];
    if (Array.isArray(enumDef)) {
        return enumDef.map(v => ({ value: v, label: v }));
    }
    return Object.entries(enumDef)
        .filter(([k]) => k !== "_label")
        .map(([value, label]) => ({ value, label: String(label) }));
}

/**
 * Get the display label for an enum value.
 * @param {string[] | Record<string, string>} enumDef
 * @param {string} value
 * @returns {string}
 */
export function getEnumLabel(enumDef, value) {
    if (!enumDef) return value;
    if (Array.isArray(enumDef)) return value;
    const label = enumDef[value];
    return label != null ? String(label) : value;
}

/**
 * Get the type-level display name for an enum.
 * @param {string[] | Record<string, string>} enumDef
 * @returns {string}
 */
export function getEnumTypeName(enumDef) {
    if (!enumDef || Array.isArray(enumDef)) return "";
    return enumDef._label || "";
}

/**
 * Get just the values array from an enum definition.
 * @param {string[] | Record<string, string>} enumDef
 * @returns {string[]}
 */
export function getEnumValues(enumDef) {
    if (!enumDef) return [];
    if (Array.isArray(enumDef)) return enumDef;
    return Object.keys(enumDef).filter(k => k !== "_label");
}

/**
 * Normalize enum definition to object format (excluding _label).
 * @param {string[] | Record<string, string>} enumDef
 * @returns {Record<string, string>}
 */
export function normalizeEnum(enumDef) {
    if (!enumDef) return {};
    if (Array.isArray(enumDef)) {
        const obj = {};
        for (const v of enumDef) obj[v] = v;
        return obj;
    }
    const { _label, ...rest } = enumDef;
    return { ...rest };
}
