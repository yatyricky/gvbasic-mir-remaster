<script>
    import { normalizeEnum, getEnumLabel } from "../../lib/enum-utils.js";
    import { findEnumRefs } from "../../lib/api-client.js";
    import BlockedDialog from "../BlockedDialog.svelte";

    /** @type {{ enums: Record<string, any>, onUpdate: (enums: Record<string, any>) => void }} */
    let { enums, onUpdate } = $props();

    let expandedEnum = $state(null);
    let newEnumName = $state("");
    let newValue = $state("");
    let newLabel = $state("");

    let blocked = $state(null);

    const enumNames = $derived(Object.keys(enums));

    function addEnum() {
        if (!newEnumName.trim()) return;
        if (enums[newEnumName]) return;
        const next = { ...enums, [newEnumName]: { _label: newEnumName } };
        onUpdate(next);
        newEnumName = "";
    }

    function updateEnumLabel(name, label) {
        const next = { ...enums };
        const obj = normalizeEnum(next[name]);
        next[name] = { _label: label, ...obj };
        onUpdate(next);
    }

    async function removeEnum(name) {
        try {
            const refs = await findEnumRefs(name);
            if (refs.length > 0) {
                blocked = {
                    title: `Cannot delete enum "${name}"`,
                    message: `${refs.length} references exist. Remove all references before deleting.`,
                    details: refs.map(r => `${r.table} → ${r.row}.${r.column} [${r.enumValue}]`),
                };
                return;
            }
            const next = { ...enums };
            delete next[name];
            onUpdate(next);
            expandedEnum = null;
        } catch (e) {
            blocked = { title: "Error", message: e.message || "Failed to check references.", details: [] };
        }
    }

    function addValue(index) {
        const val = newValue.trim();
        if (!val) return;
        const name = enumNames[index];
        const obj = normalizeEnum(enums[name]);
        if (val in obj) {
            blocked = { title: "Duplicate value", message: `"${val}" already exists in ${name}.`, details: [] };
            return;
        }
        obj[val] = newLabel.trim() || val;
        const next = { ...enums };
        next[name] = { _label: next[name]?._label, ...obj };
        onUpdate(next);
        newValue = "";
        newLabel = "";
    }

    async function removeValue(enumIdx, val) {
        try {
            const name = enumNames[enumIdx];
            const refs = await findEnumRefs(name);
            const valRefs = refs.filter(r => r.enumValue === val);
            if (valRefs.length > 0) {
                blocked = {
                    title: `Cannot delete "${val}" from ${name}`,
                    message: `${valRefs.length} references exist. Remove all references before deleting.`,
                    details: valRefs.map(r => `${r.table} → ${r.row}.${r.column}`),
                };
                return;
            }
            const obj = normalizeEnum(enums[name]);
            delete obj[val];
            const next = { ...enums };
            next[name] = { _label: next[name]?._label, ...obj };
            onUpdate(next);
        } catch (e) {
            blocked = { title: "Error", message: e.message || "Failed to check references.", details: [] };
        }
    }

    function updateLabel(enumIdx, val, label) {
        const name = enumNames[enumIdx];
        const obj = normalizeEnum(enums[name]);
        obj[val] = label;
        const next = { ...enums };
        next[name] = { _label: next[name]?._label, ...obj };
        onUpdate(next);
    }

    function getDataEntries(enumDef) {
        const obj = normalizeEnum(enumDef);
        const { _label, ...rest } = obj;
        return Object.entries(rest).map(([value, label]) => ({ value, label }));
    }

    function getEnumTypeLabel(enumDef) {
        if (enumDef && typeof enumDef === "object" && !Array.isArray(enumDef) && enumDef._label) {
            return enumDef._label;
        }
        return "";
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
                <span class="enum-label">{getEnumTypeLabel(enums[name])}</span>
                <span class="enum-count">{getDataEntries(enums[name]).length} values</span>
                <button class="remove-btn" onclick={(e) => { e.stopPropagation(); removeEnum(name); }}>×</button>
            </div>
            {#if expandedEnum === i}
                <div class="enum-body">
                    <!-- Enum type label -->
                    <div class="type-label-row">
                        <span class="type-label-title">Display Name</span>
                        <input
                            type="text"
                            class="type-label-input"
                            value={getEnumTypeLabel(enums[name])}
                            placeholder={name}
                            oninput={(e) => updateEnumLabel(name, e.currentTarget.value)}
                        />
                    </div>

                    <!-- Values table -->
                    <div class="values-table">
                        <div class="vt-header">
                            <span class="vt-h vt-value">Value</span>
                            <span class="vt-h vt-label">Display</span>
                            <span class="vt-h vt-actions"></span>
                        </div>
                        {#each getDataEntries(enums[name]) as { value, label }}
                            <div class="vt-row">
                                <span class="vt-val">{value}</span>
                                <input
                                    type="text"
                                    class="vt-label-input"
                                    value={label}
                                    oninput={(e) => updateLabel(i, value, e.currentTarget.value)}
                                />
                                <button class="vt-remove" onclick={() => removeValue(i, value)}>×</button>
                            </div>
                        {/each}
                    </div>

                    <!-- Add new value -->
                    <div class="add-value-row">
                        <input
                            type="text"
                            class="add-input small"
                            placeholder="value (key)"
                            value={newValue}
                            oninput={(e) => newValue = e.currentTarget.value}
                        />
                        <input
                            type="text"
                            class="add-input small"
                            placeholder="display label"
                            value={newLabel}
                            oninput={(e) => newLabel = e.currentTarget.value}
                            onkeydown={(e) => e.key === "Enter" && addValue(i)}
                        />
                        <button class="add-btn small" onclick={() => addValue(i)}>+</button>
                    </div>
                </div>
            {/if}
        </div>
    {/each}
</div>

{#if blocked}
    <BlockedDialog
        title={blocked.title}
        message={blocked.message}
        details={blocked.details}
        onClose={() => blocked = null}
    />
{/if}

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
    .add-input.small {
        padding: 4px 8px;
        font-size: 12px;
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
        white-space: nowrap;
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
        font-family: monospace;
    }
    .enum-label {
        color: var(--text-secondary);
        font-size: 12px;
    }
    .enum-count {
        color: var(--text-muted);
        font-size: 11px;
        margin-left: auto;
    }
    .remove-btn {
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
    .type-label-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
    }
    .type-label-title {
        font-size: 11px;
        color: var(--text-muted);
        text-transform: uppercase;
        flex-shrink: 0;
    }
    .type-label-input {
        flex: 1;
        padding: 4px 8px;
        background: var(--bg-primary);
        border: 1px solid var(--border);
        border-radius: 4px;
        color: var(--text-primary);
        font-size: 12px;
        outline: none;
    }
    .type-label-input:focus {
        border-color: var(--accent);
    }
    .values-table {
        margin-bottom: 10px;
    }
    .vt-header {
        display: grid;
        grid-template-columns: 120px 1fr 32px;
        gap: 8px;
        padding: 2px 0 4px;
        border-bottom: 1px solid var(--border);
    }
    .vt-h {
        font-size: 10px;
        color: var(--text-muted);
        text-transform: uppercase;
    }
    .vt-row {
        display: grid;
        grid-template-columns: 120px 1fr 32px;
        gap: 8px;
        align-items: center;
        padding: 3px 0;
        border-bottom: 1px solid var(--bg-surface);
    }
    .vt-val {
        font-size: 12px;
        font-family: monospace;
        color: var(--text-primary);
    }
    .vt-label-input {
        padding: 2px 6px;
        background: var(--bg-primary);
        border: 1px solid var(--border);
        border-radius: 3px;
        color: var(--text-primary);
        font-size: 12px;
        outline: none;
    }
    .vt-label-input:focus {
        border-color: var(--accent);
    }
    .vt-remove {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: 0;
        font-size: 14px;
    }
    .vt-remove:hover {
        color: var(--error);
    }
    .add-value-row {
        display: flex;
        gap: 6px;
    }
</style>
