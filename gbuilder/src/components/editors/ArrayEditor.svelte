<script>
    import StringEditor from "./StringEditor.svelte";
    import NumberEditor from "./NumberEditor.svelte";
    import EnumEditor from "./EnumEditor.svelte";
    import { parseType } from "../../lib/type-parser.js";

    /** @type {{ value: any[], elementType: string, onChange: (v: any[]) => void, enums?: Record<string, string[]> }} */
    let { value, elementType, onChange, enums } = $props();

    let items = $state([]);

    // Sync from parent
    $effect(() => {
        items = value ? [...value] : [];
    });
    let parsed = $derived(parseType(elementType));

    function sync(newItems) {
        items = newItems;
        onChange([...newItems]);
    }

    function updateItem(index, val) {
        const next = [...items];
        next[index] = val;
        sync(next);
    }

    function addItem() {
        let def = "";
        if (parsed.kind === "primitive" && parsed.base === "number") def = 0;
        sync([...items, def]);
    }

    function removeItem(index) {
        sync(items.filter((_, i) => i !== index));
    }
</script>

<div class="arr-editor">
    {#each items as item, i}
        <div class="arr-row">
            <span class="arr-index">{i}</span>
            <div class="arr-input">
                {#if parsed.kind === "primitive" && parsed.base === "number"}
                    <NumberEditor value={item ?? 0} onChange={(v) => updateItem(i, v)} />
                {:else if parsed.kind === "enum"}
                    <EnumEditor value={item ?? ""} options={enums?.[parsed.name] ?? []} onChange={(v) => updateItem(i, v)} />
                {:else}
                    <StringEditor value={item ?? ""} onChange={(v) => updateItem(i, v)} />
                {/if}
            </div>
            <button class="arr-remove" onclick={() => removeItem(i)}>×</button>
        </div>
    {/each}
    <button class="arr-add" onclick={addItem}>+ Add item</button>
</div>

<style>
    .arr-editor {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .arr-row {
        display: flex;
        align-items: center;
        gap: 4px;
    }
    .arr-index {
        color: var(--text-muted);
        font-size: 11px;
        width: 20px;
        text-align: right;
        flex-shrink: 0;
    }
    .arr-input {
        flex: 1;
        min-width: 0;
    }
    .arr-remove {
        background: none;
        border: 1px solid var(--border);
        border-radius: 4px;
        color: var(--text-muted);
        cursor: pointer;
        padding: 0 6px;
        font-size: 14px;
        flex-shrink: 0;
    }
    .arr-remove:hover {
        color: var(--error);
        border-color: var(--error);
    }
    .arr-add {
        background: none;
        border: 1px dashed var(--border);
        border-radius: 4px;
        color: var(--text-muted);
        cursor: pointer;
        padding: 4px 8px;
        font-size: 12px;
        text-align: center;
    }
    .arr-add:hover {
        color: var(--accent);
        border-color: var(--accent);
    }
</style>
