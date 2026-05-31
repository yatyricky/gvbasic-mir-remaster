<script>
    import "./styles/theme.css";
    import Sidebar from "./components/Sidebar.svelte";
    import Grid from "./components/Grid.svelte";
    import InspectorField from "./components/InspectorField.svelte";
    import InspectorChain from "./components/InspectorChain.svelte";
    import WelcomeScreen from "./components/project/WelcomeScreen.svelte";
    import SchemaEditor from "./components/schema/SchemaEditor.svelte";
    import { getProject, getTable, getTables, updateRow, getRow, openProject } from "./lib/api-client.js";

    let project = $state(null);
    let tables = $state([]);
    let activeTable = $state(null);
    let tableData = $state(null);
    let selectedRow = $state(null);
    let error = $state(null);
    let saveStatus = $state(null);
    let view = $state("data"); // data | schema
    let ready = $state(false);

    // Inspector chain: each entry = {table, id, row, columns, highlightField?}
    let chainPanels = $state([]);

    async function loadProject() {
        try {
            project = await getProject();
            tables = await getTables();
            ready = true;
            if (tables.length > 0 && !activeTable) {
                await selectTable(tables[0].name);
            }
        } catch {
            ready = true;
        }
    }

    async function selectTable(name) {
        activeTable = name;
        selectedRow = null;
        chainPanels = [];
        try {
            tableData = await getTable(name);
        } catch (e) {
            error = e.message;
        }
    }

    function selectRow(row) {
        selectedRow = row ? { ...row } : null;
        chainPanels = [];
    }

    function getPK() {
        if (!project || !activeTable) return "id";
        return project.tables[activeTable]?.primaryKey ?? "id";
    }

    async function handleFieldChange(columnName, newValue) {
        if (!selectedRow || !activeTable) return;
        selectedRow[columnName] = newValue;
        selectedRow = { ...selectedRow };
        const pk = getPK();
        const id = selectedRow[pk];
        try {
            await updateRow(activeTable, id, selectedRow);
            saveStatus = "saved";
            if (tableData) {
                const idx = tableData.rows.findIndex(r => r[pk] === id);
                if (idx !== -1) tableData.rows[idx] = { ...selectedRow };
            }
            setTimeout(() => saveStatus = null, 1500);
        } catch (e) {
            saveStatus = "error";
            error = e.message;
        }
    }

    // Open a FK reference in the chain
    // fromPanelIndex: which panel the FK was clicked in (0-based)
    // Destroys all panels AFTER fromPanelIndex, then appends the new one
    async function openFKInChain(targetTable, targetId, fromPanelIndex) {
        try {
            const { columns, row } = await getRow(targetTable, targetId);
            if (!row) return;
            // Keep panels 0..fromPanelIndex, destroy everything after, then append
            const newPanels = chainPanels.slice(0, fromPanelIndex + 1);
            newPanels.push({
                table: targetTable,
                id: targetId,
                row: { ...row },
                columns,
                highlightField: null,
            });
            chainPanels = newPanels;
        } catch (e) {
            error = e.message;
        }
    }

    // Open a FK from the main inspector (panelIndex = -1 means from main)
    async function openFKFromMain(targetTable, targetId) {
        try {
            const { columns, row } = await getRow(targetTable, targetId);
            if (!row) return;
            chainPanels = [{
                table: targetTable,
                id: targetId,
                row: { ...row },
                columns,
                highlightField: null,
            }];
        } catch (e) {
            error = e.message;
        }
    }

    // Close a chain panel (and all panels after it)
    function closeChainPanel(index) {
        chainPanels = chainPanels.slice(0, index);
    }

    // Handle field change in a chain panel
    async function handleChainFieldChange(panelIndex, columnName, newValue) {
        const panel = chainPanels[panelIndex];
        if (!panel) return;
        panel.row[columnName] = newValue;
        chainPanels = [...chainPanels]; // trigger reactivity
        const cfg = project.tables[panel.table];
        const pk = cfg?.primaryKey || "id";
        try {
            await updateRow(panel.table, panel.id, panel.row);
        } catch (e) {
            error = e.message;
        }
    }

    async function handleSwitchWorkspace(p) {
        project = p;
        activeTable = null;
        selectedRow = null;
        chainPanels = [];
        tableData = null;
        await loadProject();
    }

    function onProjectReady(p) {
        project = p;
        ready = true;
        loadProject();
    }

    function onSchemaUpdate(p) {
        project = p;
        loadProject();
    }

    loadProject();
</script>

{#if !ready}
    <div class="loading">Loading...</div>
{:else if !project}
    <WelcomeScreen onReady={onProjectReady} />
{:else if view === "schema"}
    <SchemaEditor {project} onUpdate={onSchemaUpdate} onBack={() => view = "data"} />
{:else}
    <div class="app">
        <aside class="sidebar">
            <Sidebar
                {tables}
                {activeTable}
                onSelect={selectTable}
                projectPath={project?._path}
                onSwitchWorkspace={handleSwitchWorkspace}
            />
            <div class="sidebar-footer">
                <button class="settings-btn" onclick={() => view = "schema"}>⚙ Schema</button>
            </div>
        </aside>
        <main class="grid-area">
            {#if error}
                <div class="error">{error}</div>
            {:else if tableData}
                <Grid
                    columns={tableData.columns}
                    rows={tableData.rows}
                    {selectedRow}
                    onSelectRow={selectRow}
                    {project}
                />
            {:else}
                <div class="empty">No tables defined. Click ⚙ Schema to create tables.</div>
            {/if}
        </main>
        <div class="inspector-area">
            {#if selectedRow && tableData}
                <div class="inspector-panel">
                    <div class="inspector-header">
                        <span class="inspector-title">Inspector</span>
                        {#if saveStatus === "saved"}
                            <span class="save-ok">✓</span>
                        {:else if saveStatus === "error"}
                            <span class="save-err">✗</span>
                        {/if}
                    </div>
                    <div class="inspector-content">
                        {#each tableData.columns as col}
                            {@const linked = col.linkedColumn
                                ? {
                                    name: col.linkedColumn,
                                    value: selectedRow[col.linkedColumn],
                                    onChange: (v) => handleFieldChange(col.linkedColumn, v),
                                }
                                : undefined}
                            <InspectorField
                                column={col}
                                value={selectedRow[col.name]}
                                onChange={(v) => handleFieldChange(col.name, v)}
                                enums={project?.enums ?? {}}
                                {project}
                                onOpenFK={(table, id) => openFKFromMain(table, id)}
                                linkedColumn={linked}
                            />
                        {/each}
                    </div>
                </div>
                {#if chainPanels.length > 0}
                    <InspectorChain
                        panels={chainPanels}
                        {project}
                        onClose={closeChainPanel}
                        onOpenFK={openFKInChain}
                        onFieldChange={handleChainFieldChange}
                    />
                {/if}
            {:else}
                <div class="inspector-empty">Select a row to inspect</div>
            {/if}
        </div>
    </div>
{/if}

<style>
    .app {
        display: flex;
        height: 100vh;
    }
    .sidebar {
        width: var(--sidebar-width);
        min-width: var(--sidebar-width);
        background: var(--bg-secondary);
        border-right: 1px solid var(--border);
        overflow: visible;
        display: flex;
        flex-direction: column;
        position: relative;
        z-index: 10;
    }
    .sidebar-footer {
        padding: 8px;
        border-top: 1px solid var(--border);
        margin-top: auto;
    }
    .settings-btn {
        width: 100%;
        padding: 6px;
        background: none;
        border: 1px solid var(--border);
        border-radius: 4px;
        color: var(--text-muted);
        cursor: pointer;
        font-size: 12px;
    }
    .settings-btn:hover {
        background: var(--bg-surface);
        color: var(--text-primary);
    }
    .grid-area {
        flex: 1;
        overflow: auto;
        position: relative;
        z-index: 1;
    }
    .inspector-area {
        display: flex;
        flex-shrink: 0;
        overflow-x: auto;
    }
    .inspector-panel {
        width: var(--inspector-width);
        min-width: var(--inspector-width);
        background: var(--bg-secondary);
        border-left: 1px solid var(--border);
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    }
    .error { padding: 16px; color: var(--error); }
    .empty { padding: 16px; color: var(--text-muted); text-align: center; margin-top: 40px; }
    .loading { padding: 16px; color: var(--text-muted); }
    .inspector-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 12px;
        border-bottom: 1px solid var(--border);
        flex-shrink: 0;
    }
    .inspector-title { color: var(--accent); font-size: 14px; font-weight: 600; }
    .save-ok { color: var(--success); font-size: 14px; }
    .save-err { color: var(--error); font-size: 14px; }
    .inspector-content { padding: 0 12px 12px; flex: 1; overflow-y: auto; }
    .inspector-empty { padding: 16px; color: var(--text-muted); text-align: center; margin-top: 40px; }
</style>
