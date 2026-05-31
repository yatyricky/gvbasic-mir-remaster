<script>
    /** @type {{ enums: Record<string, string[]>, onUpdate: (enums: Record<string, string[]>) => void }} */
    let { enums, onUpdate } = $props();

    let expandedEnum = $state(null);
    let newEnumName = $state("");
    let newValue = $state("");

    const enumNames = $derived(Object.keys(enums));

    function addEnum() {
        if (!newEnumName.trim()) return;
        if (enums[newEnumName]) return;
        const next = { ...enums, [newEnumName]: [] };
        onUpdate(next);
        newEnumName = "";
    }

    function removeEnum(name) {
        const next = { ...enums };
        delete next[name];
        onUpdate(next);
        expandedEnum = null;
    }

    function addValue(index) {
        if (!newValue.trim()) return;
        const name = enumNames[index];
        const next = { ...enums };
        next[name] = [...next[name], newValue.trim()];
        onUpdate(next);
        newValue = "";
    }

    function removeValue(enumIdx, valIdx) {
        const name = enumNames[enumIdx];
        const next = { ...enums };
        next[name] = next[name].filter((_, i) => i !== valIdx);
        onUpdate(next);
    }
</script>

<div class="enum-manager">
    <div class="add-row">
        <input
            type="text"
            class="add-input"
            placeholder="New enum name..."
            value={newEnumName}
            oninput={(e) => newEnumName = e.currentTarget.value}
            onkeydown={(e) => e.key === "Enter" && addEnum()}
        />
        <button class="add-btn" onclick={addEnum}>+ Add Enum</button>
    </div>

    {#each enumNames as name, i}
        <div class="enum-card">
            <div
                class="enum-header"
                onclick={() => expandedEnum = expandedEnum === i ? null : i}
            >
                <span class="enum-name">{name}</span>
                <span class="enum-count">{enums[name].length} values</span>
                <button class="remove-btn" onclick={(e) => { e.stopPropagation(); removeEnum(name); }}>×</button>
            </div>
            {#if expandedEnum === i}
                <div class="enum-body">
                    <div class="values-list">
                        {#each enums[name] as val, vi}
                            <div class="value-row">
                                <span class="value-text">{val}</span>
                                <button class="val-remove" onclick={() => removeValue(i, vi)}>×</button>
                            </div>
                        {/each}
                    </div>
                    <div class="add-value-row">
                        <input
                            type="text"
                            class="add-input"
                            placeholder="New value..."
                            value={newValue}
                            oninput={(e) => newValue = e.currentTarget.value}
                            onkeydown={(e) => e.key === "Enter" && addValue(i)}
                        />
                        <button class="add-btn small" onclick={() => addValue(i)}>+</button>
                    </div>
                </div>
            {/if}
        </div>
    {/each}
</div>

<style>
    .enum-manager {
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
    .add-btn.small {
        padding: 4px 10px;
        font-size: 12px;
    }
    .add-btn:hover {
        background: var(--accent-hover);
    }
    .enum-card {
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        border-radius: 8px;
        overflow: hidden;
    }
    .enum-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        cursor: pointer;
    }
    .enum-header:hover {
        background: var(--bg-surface);
    }
    .enum-name {
        color: var(--accent);
        font-weight: 600;
        font-size: 14px;
    }
    .enum-count {
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
    .enum-body {
        border-top: 1px solid var(--border);
        padding: 12px 14px;
    }
    .values-list {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 10px;
    }
    .value-row {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 3px 8px;
        background: var(--bg-primary);
        border: 1px solid var(--border);
        border-radius: 4px;
        font-size: 12px;
    }
    .value-text {
        color: var(--text-primary);
    }
    .val-remove {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: 0;
        font-size: 12px;
    }
    .val-remove:hover {
        color: var(--error);
    }
    .add-value-row {
        display: flex;
        gap: 8px;
    }
</style>
