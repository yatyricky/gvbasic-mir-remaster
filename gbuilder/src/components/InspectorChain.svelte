<script>
    import InspectorField from "./InspectorField.svelte";
    import { getRow } from "../lib/api-client.js";
    import { getRowDisplay } from "../lib/template.js";

    /**
     * @type {{
     *   panels: Array<{table: string, id: string, row: any, columns: any[], highlightField?: string}>,
     *   project: any,
     *   onClose: (index: number) => void,
     *   onOpenFK: (table: string, id: string, fromPanel: number) => void,
     *   onFieldChange: (panelIndex: number, column: string, value: any) => void
     * }}
     */
    let { panels, project, onClose, onOpenFK, onFieldChange } = $props();

    function getTableConfig(tableName) {
        return project?.tables?.[tableName];
    }
</script>

<div class="chain" class:scroll={panels.length > 3}>
    {#each panels as panel, i}
        {@const tableCfg = getTableConfig(panel.table)}
        <div class="panel" class:last={i === panels.length - 1}>
            <div class="panel-header">
                <span class="panel-table">{panel.table}</span>
                <span class="panel-title">{getRowDisplay(tableCfg, panel.row)}</span>
                <button class="panel-close" onclick={() => onClose(i)}>×</button>
            </div>
            <div class="panel-body">
                {#each panel.columns.filter(c => c.name !== "_id") as col}
                    {@const isHighlight = panel.highlightField === col.name}
                    <div class="panel-field" class:highlight={isHighlight}>
                        <InspectorField
                            column={col}
                            value={panel.row[col.name]}
                            onChange={(v) => onFieldChange(i, col.name, v)}
                            enums={project?.enums ?? {}}
                            project={project}
                            onOpenFK={(table, id) => onOpenFK(table, id, i)}
                        />
                    </div>
                {/each}
            </div>
        </div>
    {/each}
</div>

<style>
    .chain {
        display: flex;
        height: 100%;
    }
    .chain.scroll {
        overflow-x: auto;
    }
    .panel {
        width: var(--inspector-width);
        min-width: var(--inspector-width);
        background: var(--bg-secondary);
        border-left: 1px solid var(--border);
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    }
    .panel.last {
        border-left: 2px solid var(--accent);
    }
    .panel-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: var(--bg-surface);
        border-bottom: 1px solid var(--border);
        flex-shrink: 0;
    }
    .panel-table {
        color: var(--text-muted);
        font-size: 10px;
        text-transform: uppercase;
    }
    .panel-title {
        color: var(--accent);
        font-size: 13px;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
    }
    .panel-close {
        background: none;
        border: 1px solid var(--border);
        border-radius: 4px;
        color: var(--text-muted);
        cursor: pointer;
        padding: 0 6px;
        font-size: 14px;
        flex-shrink: 0;
    }
    .panel-close:hover {
        color: var(--error);
        border-color: var(--error);
    }
    .panel-body {
        padding: 0 12px 12px;
        flex: 1;
        overflow-y: auto;
    }
    .panel-field.highlight {
        background: rgba(137, 180, 250, 0.08);
        border-radius: 4px;
        margin: 0 -8px;
        padding: 0 8px;
    }
</style>
