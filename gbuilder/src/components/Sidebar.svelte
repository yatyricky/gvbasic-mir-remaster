<script>
    import { validate, exportTable } from "../lib/api-client.js";
    import WorkspaceSwitcher from "./project/WorkspaceSwitcher.svelte";

    /** @type {{ tables: Array<{name: string, rowCount: number}>, activeTable: string, onSelect: (name: string) => void, projectPath?: string, onSwitchWorkspace?: (project: any) => void }} */
    let { tables, activeTable, onSelect, projectPath, onSwitchWorkspace } = $props();

    let errors = $state([]);
    let showErrors = $state(false);

    async function runValidate() {
        errors = await validate();
        showErrors = true;
    }

    async function handleExport() {
        if (!activeTable) return;
        const data = await exportTable(activeTable);
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${activeTable}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
</script>

<div class="sidebar-inner">
    <WorkspaceSwitcher
        currentPath={projectPath || ""}
        onSwitch={onSwitchWorkspace}
    />
    <div class="table-list">
        {#each tables as table}
            <button
                class="table-item"
                class:active={activeTable === table.name}
                onclick={() => onSelect(table.name)}
            >
                <span class="table-name">{table.name}</span>
                <span class="table-count">{table.rowCount}</span>
            </button>
        {/each}
    </div>
    <div class="sidebar-actions">
        <button class="action-btn" onclick={runValidate}>Validate</button>
        <button class="action-btn" onclick={handleExport} disabled={!activeTable}>Export</button>
    </div>
    {#if showErrors}
        <div class="validate-panel">
            <div class="validate-header">
                <span>Validation</span>
                <button class="close-btn" onclick={() => showErrors = false}>×</button>
            </div>
            {#if errors.length === 0}
                <div class="validate-ok">✓ No errors</div>
            {:else}
                <div class="validate-errors">
                    {#each errors as err}
                        <div class="error-item">
                            <span class="err-table">{err.table}</span>
                            <span class="err-row">{err.row}</span>
                            <span class="err-col">.{err.column}</span>
                            <span class="err-msg">{err.message}</span>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    {/if}
</div>

<style>
    .sidebar-inner {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    .table-list {
        flex: 1;
        overflow-y: auto;
    }
    .table-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 8px 16px;
        border: none;
        background: none;
        color: var(--text-secondary);
        cursor: pointer;
        font-size: 13px;
        text-align: left;
    }
    .table-item:hover {
        background: var(--bg-surface);
        color: var(--text-primary);
    }
    .table-item.active {
        background: var(--bg-surface);
        color: var(--accent);
        border-left: 3px solid var(--accent);
    }
    .table-count {
        font-size: 11px;
        color: var(--text-muted);
        background: var(--bg-primary);
        padding: 1px 6px;
        border-radius: 8px;
    }
    .sidebar-actions {
        display: flex;
        gap: 4px;
        padding: 8px;
        border-top: 1px solid var(--border);
    }
    .action-btn {
        flex: 1;
        padding: 5px 8px;
        background: var(--bg-surface);
        border: 1px solid var(--border);
        border-radius: 4px;
        color: var(--text-secondary);
        cursor: pointer;
        font-size: 11px;
    }
    .action-btn:hover {
        background: var(--bg-hover);
        color: var(--text-primary);
    }
    .action-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
    .validate-panel {
        border-top: 1px solid var(--border);
        max-height: 200px;
        overflow-y: auto;
    }
    .validate-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 12px;
        background: var(--bg-surface);
        font-size: 11px;
        color: var(--text-secondary);
    }
    .close-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        font-size: 14px;
    }
    .validate-ok {
        padding: 8px 12px;
        color: var(--success);
        font-size: 12px;
    }
    .validate-errors {
        padding: 4px 8px;
    }
    .error-item {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        padding: 4px;
        border-bottom: 1px solid var(--bg-surface);
        font-size: 11px;
    }
    .err-table { color: var(--accent); font-weight: 600; }
    .err-row { color: var(--text-secondary); }
    .err-col { color: var(--text-muted); }
    .err-msg { color: var(--error); width: 100%; }
</style>
