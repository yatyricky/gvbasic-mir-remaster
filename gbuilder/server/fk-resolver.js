/**
 * Resolves FK references to display names.
 */
export class FKResolver {
    constructor() {
        /** @type {Map<string, Map<string, string>>} table -> (pk -> displayName) */
        this.cache = new Map();
    }

    /**
     * Load a table's data into the cache.
     * @param {string} tableName
     * @param {string} primaryKey
     * @param {string} displayField
     * @param {any[]} rows
     */
    loadTable(tableName, primaryKey, displayField, rows) {
        const map = new Map();
        for (const row of rows) {
            const pk = row[primaryKey];
            if (pk != null) {
                map.set(String(pk), String(row[displayField] ?? pk));
            }
        }
        this.cache.set(tableName, map);
    }

    /**
     * Resolve a single FK id to its display name.
     * @param {string} tableName
     * @param {string} id
     * @returns {string|null}
     */
    resolve(tableName, id) {
        const map = this.cache.get(tableName);
        if (!map) return null;
        return map.get(String(id)) ?? null;
    }

    /**
     * Resolve multiple ids at once.
     * @param {string} tableName
     * @param {string[]} ids
     * @returns {Record<string, string>}
     */
    resolveBatch(tableName, ids) {
        const map = this.cache.get(tableName);
        if (!map) return {};
        const result = {};
        for (const id of ids) {
            const display = map.get(String(id));
            if (display != null) result[id] = display;
        }
        return result;
    }

    /**
     * Get all primary keys in a table.
     * @param {string} tableName
     * @returns {string[]}
     */
    getIds(tableName) {
        const map = this.cache.get(tableName);
        return map ? Array.from(map.keys()) : [];
    }

    /**
     * Search rows by display name (for FK editor dropdowns).
     * @param {string} tableName
     * @param {string} query
     * @param {number} limit
     * @returns {Array<{id: string, display: string}>}
     */
    search(tableName, query, limit = 50) {
        const map = this.cache.get(tableName);
        if (!map) return [];
        const q = query.toLowerCase();
        const results = [];
        for (const [id, display] of map) {
            if (id.toLowerCase().includes(q) || display.toLowerCase().includes(q)) {
                results.push({ id, display });
                if (results.length >= limit) break;
            }
        }
        return results;
    }
}
