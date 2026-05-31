<script>
    import TypePicker from "./TypePicker.svelte";

    /** @type {{ columns: Array<{name: string, type: string, meta?: string[], nullable?: boolean, linkedColumn?: string}>, tables: Record<string, any>, enums: Record<string, string[]>, onChange: (cols: any[]) => void }} */
    let { columns, tables, enums, onChange } = $props();

    const tableNames = $derived(Object.keys(tables));
    const enumNames = $derived(Object.keys(enums));

    let newColName = $state("");

    function addColumn() {
        if (!newColName.trim()) return;
        const next = [...columns, { name: newColName, type: "string" }];
        onChange(next);
        newColName = "";
    }

    function removeColumn(index) {
        onChange(columns.filter((_, i) => i !== index));
    }

    function updateCol(index, field, value) {
        const next = columns.map((c, i) => i === index ? { ...c, [field]: value } : c);
        onChange(next);
    }

    function moveColumn(index, dir) {
        const target = index + dir;
        if (target < 0 || target >= columns.length) return;
        const next = [...columns];
        [next[index], next[target]] = [next[target], next[index]];
        onChange(next);
    }

    function toggleMeta(index, meta) {
        const col = columns[index];
        const metaArr = col.meta ? [...col.meta] : [];
        const idx = metaArr.indexOf(meta);
        if (idx === -1) metaArr.push(meta);
        else metaArr.splice(idx, 1);
        updateCol(index, "meta", metaArr);
    }
</script>

<div class="col-editor">
    <div class="col-header">
        <span class="col-h col-h-name">Name</span>
        <span class="col-h col-h-type">Type</span>
        <span class="col-h col-h-meta">Meta</span>
        <span class="col-h col-h-linked">Linked</span>
        <span class="col-h col-h-actions"></span>
    </div>
    {#each columns as col, i}
        <div class="col-row">
            <input
                class="col-input col-name"
                type="text"
                value={col.name}
                oninput={(e) => updateCol(i, "name", e.currentTarget.value)}
            />
            <div class="col-type">
                <TypePicker
                    value={col.type}
                    tables={tableNames}
                    enums={enumNames}
                    onChange={(v) => updateCol(i, "type", v)}
                />
            </div>
            <div class="col-meta">
                {#each ["Index", "Group", "Nullable", "Hidden"] as m}
                    <label class="meta-tag">
                        <input
                            type="checkbox"
                            checked={(col.meta || []).includes(m)}
                            onchange={() => toggleMeta(i, m)}
                        />
                        <span>{m}</span>
                    </label>
                {/each}
            </div>
            <input
                class="col-input col-linked"
                type="text"
                value={col.linkedColumn || ""}
                placeholder="none"
                oninput={(e) => updateCol(i, "linkedColumn", e.currentTarget.value || undefined)}
            />
            <div class="col-actions">
                <button class="act-btn" onclick={() => moveColumn(i, -1)} disabled={i === 0}>↑</button>
                <button class="act-btn" onclick={() => moveColumn(i, 1)} disabled={i === columns.length - 1}>↓</button>
                <button class="act-btn del" onclick={() => removeColumn(i)}>×</button>
            </div>
        </div>
    {/each}
    <div class="col-add">
        <input
            type="text"
            class="col-input"
            placeholder="New column name..."
            value={newColName}
            oninput={(e) => newColName = e.currentTarget.value}
            onkeydown={(e) => e.key === "Enter" && addColumn()}
        />
        <button class="add-btn" onclick={addColumn}>+ Add</button>
    </div>
</div>

<style>
    .col-editor {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    .col-header {
        display: grid;
        grid-template-columns: 120px 1fr 200px 100px 80px;
        gap: 8px;
        padding: 4px 0;
        border-bottom: 1px solid var(--border);
    }
    .col-h {
        font-size: 10px;
        color: var(--text-muted);
        text-transform: uppercase;
    }
    .col-row {
        display: grid;
        grid-template-columns: 120px 1fr 200px 100px 80px;
        gap: 8px;
        align-items: start;
        padding: 4px 0;
        border-bottom: 1px solid var(--bg-surface);
    }
    .col-input {
        padding: 4px 8px;
        background: var(--bg-primary);
        border: 1px solid var(--border);
        border-radius: 4px;
        color: var(--text-primary);
        font-size: 12px;
        outline: none;
        width: 100%;
    }
    .col-input:focus {
        border-color: var(--accent);
    }
    .col-type {
        min-width: 0;
    }
    .col-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
    }
    .meta-tag {
        display: flex;
        align-items: center;
        gap: 2px;
        font-size: 10px;
        color: var(--text-muted);
        cursor: pointer;
    }
    .meta-tag input {
        accent-color: var(--accent);
        width: 12px;
        height: 12px;
    }
    .col-actions {
        display: flex;
        gap: 2px;
    }
    .act-btn {
        background: none;
        border: 1px solid var(--border);
        border-radius: 3px;
        color: var(--text-muted);
        cursor: pointer;
        padding: 2px 6px;
        font-size: 11px;
    }
    .act-btn:hover {
        background: var(--bg-surface);
        color: var(--text-primary);
    }
    .act-btn.del:hover {
        color: var(--error);
        border-color: var(--error);
    }
    .act-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }
    .col-add {
        display: flex;
        gap: 8px;
        margin-top: 4px;
    }
    .add-btn {
        padding: 4px 12px;
        background: var(--accent);
        color: var(--bg-primary);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
        white-space: nowrap;
    }
</style>
