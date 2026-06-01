<script>
    import TableManager from "./TableManager.svelte";
    import EnumManager from "./EnumManager.svelte";
    import { saveSchema } from "../../lib/api-client.js";

    /** @type {{ project: any, activeTable: string|null, onUpdate: (p: any) => void, onBack: () => void }} */
    let { project, activeTable, onUpdate, onBack } = $props();

    let tab = $state("tables"); // tables | enums
    let saveStatus = $state(null);

    async function handleSave(updated) {
        try {
            await saveSchema(updated);
            onUpdate(updated);
            saveStatus = "saved";
            setTimeout(() => saveStatus = null, 1500);
        } catch (e) {
            saveStatus = "error";
        }
    }

    function updateTables(tables) {
        handleSave({ ...project, tables });
    }

    function updateEnums(enums) {
        handleSave({ ...project, enums });
    }
</script>

<div class="schema-editor">
    <div class="schema-header">
        <button class="back-btn" onclick={onBack}>← Back</button>
        <span class="schema-title">Schema: {project.name}</span>
        <span class="save-status">
            {#if saveStatus === "saved"}<span class="ok">✓ Saved</span>{/if}
            {#if saveStatus === "error"}<span class="err">✗ Error</span>{/if}
        </span>
    </div>
    <div class="schema-tabs">
        <button class="tab" class:active={tab === "tables"} onclick={() => tab = "tables"}>Tables</button>
        <button class="tab" class:active={tab === "enums"} onclick={() => tab = "enums"}>Enums</button>
    </div>
    <div class="schema-body">
        {#if tab === "tables"}
            <TableManager tables={project.tables} enums={project.enums} activeTable={activeTable} onUpdate={updateTables} />
        {:else}
            <EnumManager enums={project.enums} onUpdate={updateEnums} />
        {/if}
    </div>
</div>

<style>
    .schema-editor {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background: var(--bg-primary);
    }
    .schema-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 16px;
        background: var(--bg-secondary);
        border-bottom: 1px solid var(--border);
    }
    .back-btn {
        background: none;
        border: 1px solid var(--border);
        border-radius: 4px;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 4px 10px;
        font-size: 13px;
    }
    .back-btn:hover {
        color: var(--text-primary);
        background: var(--bg-surface);
    }
    .schema-title {
        color: var(--accent);
        font-weight: 600;
    }
    .save-status {
        margin-left: auto;
        font-size: 12px;
    }
    .save-status .ok { color: var(--success); }
    .save-status .err { color: var(--error); }
    .schema-tabs {
        display: flex;
        gap: 0;
        background: var(--bg-secondary);
        border-bottom: 1px solid var(--border);
        padding: 0 16px;
    }
    .tab {
        padding: 8px 16px;
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        color: var(--text-muted);
        cursor: pointer;
        font-size: 13px;
    }
    .tab:hover {
        color: var(--text-primary);
    }
    .tab.active {
        color: var(--accent);
        border-bottom-color: var(--accent);
    }
    .schema-body {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
    }
</style>
