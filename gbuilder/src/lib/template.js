/**
 * Render a display template with row data.
 * Template format: "literal text {fieldName} more text"
 * @param {string} template - e.g. "({id}){name}-{statType}"
 * @param {Record<string, any>} row
 * @returns {string}
 */
export function renderTemplate(template, row) {
    if (!template) return "";
    return template.replace(/\{(\w+)\}/g, (_, key) => {
        const val = row[key];
        if (val == null) return "";
        if (typeof val === "object") return "";
        return String(val);
    });
}

/**
 * Build a display string for a row using its table's displayTemplate.
 * Falls back to displayField, then primaryKey, then JSON.
 * @param {object} tableConfig - table config from project.json
 * @param {Record<string, any>} row
 * @returns {string}
 */
export function getRowDisplay(tableConfig, row) {
    if (!row) return "";
    if (tableConfig.displayTemplate) {
        return renderTemplate(tableConfig.displayTemplate, row);
    }
    const field = tableConfig.displayField || tableConfig.primaryKey || "id";
    return String(row[field] ?? "");
}
