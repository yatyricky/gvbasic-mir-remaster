<script>
    import ColumnEditor from "./ColumnEditor.svelte";

    /** @type {{ tables: Record<string, any>, enums: Record<string, string[]>, onUpdate: (tables: Record<string, any>) => void }} */
    let { tables, enums, onUpdate } = $props();

    let expandedTable = $state(null);
    let newTableName = $state("");

    const tableNames = $derived(Object.keys(tables));

    function addTable() {
        if (!newTableName.trim()) return;
        if (tables[newTableName]) return;
        const next = { ...tables };
        next[newTableName] = {
            file: `${newTableName}.json`,
            primaryKey: "id",
            displayField: "name",
            columns: [{ name: "id", type: "string", meta: ["Index"] }],
        };
        onUpdate(next);
        newTableName = "";
        expandedTable = Object.keys(next).length - 1;
    }

    function removeTable(name) {
        const next = { ...tables };
        delete next[name];
        onUpdate(next);
        expandedTable = null;
    }

    function updateColumns(tableIdx, columns) {
        const name = tableNames[tableIdx];
        const next = { ...tables };
        next[name] = { ...next[name], columns };
        onUpdate(next);
    }

    function updateDisplayField(tableIdx, field) {
        const name = tableNames[tableIdx];
        const next = { ...tables };
        next[name] = { ...next[name], displayField: field };
        onUpdate(next);
    }
</script>

<div class="table-manager">
    <div class="add-row">
        <input
            type="text"
            class="add-input"
            placeholder="New table name..."
            value={newTableName}
            oninput={(e) => newTableName = e.currentTarget.value}
            onkeydown={(e) => e.key === "Enter" && addTable()}
        />
        <button class="add-btn" onclick={addTable}>+ Add Table</button>
    </div>

    {#each tableNames as name, i}
        <div class="table-card">
            <div
                class="table-header"
                onclick={() => expandedTable = expandedTable === i ? null : i}
            >
                <span class="table-name">{name}</span>
                <span class="table-meta">
                    {tables[name].columns?.length ?? 0} cols
                    · PK: {tables[name].primaryKey}
                    · display: {tables[name].displayField}
                </span>
                <button class="remove-btn" onclick={(e) => { e.stopPropagation(); removeTable(name); }}>×</button>
            </div>
            {#if expandedTable === i}
                <div class="table-body">
                    <div class="table-props">
                        <label>
                            <span>Display Field</span>
                            <select
                                class="select"
                                value={tables[name].displayField}
                                onchange={(e) => updateDisplayField(i, e.currentTarget.value)}
                            >
                                {#each tables[name].columns || [] as col}
                                    <option value={col.name}>{col.name}</option>
                                {/each}
                            </select>
                        </label>
                    </div>
                    <ColumnEditor
                        columns={tables[name].columns || []}
                        {tables}
                        {enums}
                        onChange={(cols) => updateColumns(i, cols)}
                    />
                </div>
            {/if}
        </div>
    {/each}
</div>

<style>
    .table-manager {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .add-row {
        display: flex;
        gap: 8px;
        margin-bottom: 8px;
    }
    .add-input {
        flex: 1;
        padding: 6px 10px;
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        border-radius: 6px;
        color: var(--text-primary);
        font-size: 13px;
        outline: none;
    }
    .add-input:focus {
        border-color: var(--accent);
    }
    .add-btn {
        padding: 6px 14px;
        background: var(--accent);
        color: var(--bg-primary);
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 600;
    }
    .add-btn:hover {
        background: var(--accent-hover);
    }
    .table-card {
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        border-radius: 8px;
        overflow: hidden;
    }
    .table-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        cursor: pointer;
    }
    .table-header:hover {
        background: var(--bg-surface);
    }
    .table-name {
        color: var(--accent);
        font-weight: 600;
        font-size: 14px;
    }
    .table-meta {
        color: var(--text-muted);
        font-size: 11px;
    }
    .remove-btn {
        margin-left: auto;
        background: none;
        border: 1px solid var(--border);
        border-radius: 4px;
        color: var(--text-muted);
        cursor: pointer;
        padding: 0 6px;
        font-size: 14px;
    }
    .remove-btn:hover {
        color: var(--error);
        border-color: var(--error);
    }
    .table-body {
        border-top: 1px solid var(--border);
        padding: 12px 14px;
    }
    .table-props {
        margin-bottom: 12px;
    }
    .table-props label {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .table-props label span {
        font-size: 12px;
        color: var(--text-secondary);
    }
    .select {
        padding: 4px 8px;
        background: var(--bg-primary);
        border: 1px solid var(--border);
        border-radius: 4px;
        color: var(--text-primary);
        font-size: 12px;
        outline: none;
    }
</style>
