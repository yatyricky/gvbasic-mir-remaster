<script>
    import GridCell from "./GridCell.svelte";
    import ColumnHeader from "./ColumnHeader.svelte";
    import { parseType } from "../lib/type-parser.js";
    import { resolveFK, getTable } from "../lib/api-client.js";
    import { getRowDisplay } from "../lib/template.js";

    /** @type {{ columns: Array<{name: string, displayName?: string, type: string}>, rows: any[], selectedRow: any, onSelectRow: (row: any) => void, project?: any }} */
    let { columns, rows, selectedRow, onSelectRow, project } = $props();

    /** @type {Map<string, Map<string, string>>} column name -> (id -> displayText) */
    let fkCache = $state(new Map());
    /** @type {Record<string, any>} column name -> filter value */
    let filters = $state({});
    /** @type {{ column: string, dir: 'asc'|'desc' } | null} */
    let sort = $state(null);

    function isSelected(row) {
        return selectedRow && columns.length > 0 && row[columns[0].name] === selectedRow[columns[0].name];
    }

    function matchesFilter(val, filter, colType, colName) {
        if (filter == null) return true;
        if (filter === "") return true;
        const t = parseType(colType);

        // boolean
        if (t.kind === "primitive" && t.base === "boolean") {
            if (filter === true) return val === true;
            if (filter === false) return val === false;
            return true;
        }

        // enum array filter (multi-select)
        if (Array.isArray(filter)) {
            return filter.includes(String(val));
        }

        // number
        if (t.kind === "primitive" && t.base === "number") {
            const s = String(filter);
            // Range: "10-20"
            const rangeMatch = s.match(/^(\d+(?:\.\d+)?)\s*[-~]\s*(\d+(?:\.\d+)?)$/);
            if (rangeMatch) {
                const lo = parseFloat(rangeMatch[1]);
                const hi = parseFloat(rangeMatch[2]);
                return val >= lo && val <= hi;
            }
            // Exact number
            const num = parseFloat(s);
            if (!isNaN(num) && s === String(num)) return val === num;
            // Substring fallback
            return String(val).includes(s);
        }

        // FK: match against resolved display text
        if (t.kind === "fk") {
            const display = fkCache.get(colName)?.get(String(val));
            return (display || String(val)).toLowerCase().includes(String(filter).toLowerCase());
        }

        // Default: case-insensitive substring
        return String(val).toLowerCase().includes(String(filter).toLowerCase());
    }

    let processedRows = $derived((() => {
        const activeFilters = Object.entries(filters).filter(([, v]) => v != null && v !== "");
        let result = rows;

        // Filter
        if (activeFilters.length > 0) {
            result = result.filter(row =>
                activeFilters.every(([colName, filter]) => {
                    const col = columns.find(c => c.name === colName);
                    return col ? matchesFilter(row[colName], filter, col.type, colName) : true;
                })
            );
        }

        // Sort
        if (sort) {
            const col = columns.find(c => c.name === sort.column);
            if (col) {
                const t = parseType(col.type);
                const dir = sort.dir === 'asc' ? 1 : -1;
                result = [...result].sort((a, b) => {
                    let va = a[sort.column];
                    let vb = b[sort.column];
                    if (va == null) return 1;
                    if (vb == null) return -1;

                    // FK: sort by display text
                    if (t.kind === "fk") {
                        va = fkCache.get(sort.column)?.get(String(va)) || String(va);
                        vb = fkCache.get(sort.column)?.get(String(vb)) || String(vb);
                    }

                    if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
                    return String(va).localeCompare(String(vb)) * dir;
                });
            }
        }

        return result;
    })());

    // Batch resolve FKs with template support
    $effect(() => {
        const fkColumns = columns.filter(c => {
            const t = parseType(c.type);
            return t.kind === "fk" || (t.kind === "array" && t.element.kind === "fk");
        });

        if (fkColumns.length === 0 || rows.length === 0) return;

        for (const col of fkColumns) {
            const t = parseType(col.type);
            const target = t.kind === "fk" ? t.target : t.element.target;
            const tableCfg = project?.tables?.[target];
            const template = tableCfg?.displayTemplate;

            const ids = [...new Set(rows.flatMap(r => {
                const v = r[col.name];
                if (v == null) return [];
                return Array.isArray(v) ? v : [v];
            }).map(String))];

            if (ids.length === 0) return;

            if (template && tableCfg) {
                getTable(target).then(({ rows: targetRows }) => {
                    const pk = tableCfg.primaryKey || "id";
                    const map = new Map();
                    for (const row of targetRows) {
                        const rowId = String(row[pk]);
                        if (ids.includes(rowId)) {
                            map.set(rowId, getRowDisplay(tableCfg, row));
                        }
                    }
                    fkCache = new Map(fkCache);
                    fkCache.set(col.name, map);
                });
            } else {
                resolveFK(target, ids).then(resolved => {
                    fkCache = new Map(fkCache);
                    fkCache.set(col.name, new Map(Object.entries(resolved)));
                });
            }
        }
    });

    function getFKDisplay(colName, id) {
        const map = fkCache.get(colName);
        return map?.get(String(id)) ?? null;
    }
</script>

<div class="grid-wrapper">
    <table class="grid">
        <thead>
            <tr>
                {#each columns as col}
                    <th>
                        <ColumnHeader
                            column={col}
                            sortDir={sort?.column === col.name ? sort.dir : null}
                            filter={filters[col.name]}
                            enums={project?.enums}
                            onSort={(dir) => {
                                sort = dir ? { column: col.name, dir } : null;
                            }}
                            onFilter={(val) => {
                                const next = { ...filters };
                                if (val == null) delete next[col.name];
                                else next[col.name] = val;
                                filters = next;
                            }}
                        />
                    </th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each processedRows as row (row[columns[0]?.name] ?? Math.random())}
                <tr
                    class:selected={isSelected(row)}
                    onclick={() => onSelectRow(row)}
                >
                    {#each columns as col}
                        <td>
                            <GridCell value={row[col.name]} column={col} {getFKDisplay} enums={project?.enums} />
                        </td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    .grid-wrapper {
        overflow: auto;
        height: 100%;
    }
    .grid {
        border-collapse: collapse;
        width: 100%;
        min-width: max-content;
    }
    th {
        position: sticky;
        top: 0;
        background: var(--bg-surface);
        border-bottom: 1px solid var(--border);
        padding: 0;
        text-align: left;
        white-space: nowrap;
        vertical-align: bottom;
    }
    td {
        padding: 4px 12px;
        border-bottom: 1px solid var(--bg-surface);
        border-right: 1px solid var(--border);
        white-space: nowrap;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    td:last-child {
        border-right: none;
    }
    tr {
        cursor: pointer;
    }
    tr:hover {
        background: var(--bg-surface);
    }
    tr.selected {
        background: var(--bg-hover);
    }
</style>
