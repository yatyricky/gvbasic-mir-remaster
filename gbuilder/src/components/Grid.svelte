<script>
    import GridCell from "./GridCell.svelte";
    import { parseType } from "../lib/type-parser.js";
    import { resolveFK, getTable } from "../lib/api-client.js";
    import { getRowDisplay } from "../lib/template.js";

    /** @type {{ columns: Array<{name: string, type: string}>, rows: any[], selectedRow: any, onSelectRow: (row: any) => void, project?: any }} */
    let { columns, rows, selectedRow, onSelectRow, project } = $props();

    /** @type {Map<string, Map<string, string>>} column name -> (id -> displayText) */
    let fkCache = $state(new Map());
    /** @type {Record<string, string>} column name -> filter value */
    let filters = $state({});

    function isSelected(row) {
        return selectedRow && columns.length > 0 && row[columns[0].name] === selectedRow[columns[0].name];
    }

    function matchesFilter(val, filter, colType) {
        if (!filter) return true;
        if (val == null) return false;
        const t = parseType(colType);
        if (t.kind === "primitive" && t.base === "number") {
            return String(val).includes(filter);
        }
        if (t.kind === "fk") {
            const display = fkCache.get(colType)?.get(String(val));
            return (display || String(val)).toLowerCase().includes(filter.toLowerCase());
        }
        return String(val).toLowerCase().includes(filter.toLowerCase());
    }

    let filteredRows = $derived(() => {
        const activeFilters = Object.entries(filters).filter(([, v]) => v);
        if (activeFilters.length === 0) return rows;
        return rows.filter(row =>
            activeFilters.every(([colName, filter]) => {
                const col = columns.find(c => c.name === colName);
                return col ? matchesFilter(row[colName], filter, col.type) : true;
            })
        );
    });

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
                // Use full row data for template rendering
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
                // Fallback to simple resolve
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
                        <div class="th-content">{col.name}</div>
                        <input
                            type="text"
                            class="col-filter"
                            placeholder="filter..."
                            value={filters[col.name] || ""}
                            oninput={(e) => {
                                const next = { ...filters };
                                next[col.name] = e.currentTarget.value;
                                filters = next;
                            }}
                        />
                    </th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each filteredRows() as row, i}
                <tr
                    class:selected={isSelected(row)}
                    onclick={() => onSelectRow(row)}
                >
                    {#each columns as col}
                        <td>
                            <GridCell value={row[col.name]} column={col} {getFKDisplay} />
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
        color: var(--text-secondary);
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        padding: 0;
        text-align: left;
        border-bottom: 1px solid var(--border);
        white-space: nowrap;
    }
    .th-content {
        padding: 6px 12px 2px;
    }
    .col-filter {
        width: 100%;
        padding: 2px 8px 4px;
        background: var(--bg-primary);
        border: none;
        border-top: 1px solid var(--border);
        color: var(--text-primary);
        font-size: 11px;
        outline: none;
    }
    .col-filter::placeholder {
        color: var(--text-muted);
    }
    td {
        padding: 4px 12px;
        border-bottom: 1px solid var(--bg-surface);
        white-space: nowrap;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
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
