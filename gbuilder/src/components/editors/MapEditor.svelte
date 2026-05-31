<script>
    import { parseType } from "../../lib/type-parser.js";
    import FKButton from "./FKButton.svelte";
    import FKEditor from "./FKEditor.svelte";
    import EnumEditor from "./EnumEditor.svelte";
    import StringEditor from "./StringEditor.svelte";
    import NumberEditor from "./NumberEditor.svelte";
    import { searchFK } from "../../lib/api-client.js";

    /**
     * @type {{
     *   value: Record<string, any>,
     *   keyType: string,
     *   valueType: string,
     *   onChange: (v: Record<string, any>) => void,
     *   enums?: Record<string, string[]>,
     *   onOpenFK?: (table: string, id: string) => void,
     *   tableConfig?: any
     * }}
     */
    let { value, keyType, valueType, onChange, enums, onOpenFK, tableConfig } = $props();

    let entries = $state(Object.entries(value || {}));
    let parsedKey = $derived(parseType(keyType));
    let parsedValue = $derived(parseType(valueType));
    let keyDisplayMap = $state(new Map());

    // Resolve FK key display texts
    $effect(() => {
        if (parsedKey.kind !== "fk") return;
        const ids = entries.map(([k]) => k).filter(Boolean);
        if (ids.length === 0) return;
        searchFK(parsedKey.target, "").then(all => {
            const map = new Map();
            for (const r of all) map.set(r.id, r.display);
            keyDisplayMap = map;
        });
    });

    function sync(newEntries) {
        entries = newEntries;
        const obj = {};
        for (const [k, v] of newEntries) {
            if (k !== "") obj[k] = v;
        }
        onChange(obj);
    }

    function updateKey(index, newKey) {
        const next = [...entries];
        next[index] = [newKey, next[index][1]];
        sync(next);
    }

    function updateValue(index, newVal) {
        const next = [...entries];
        next[index] = [next[index][0], newVal];
        sync(next);
    }

    function addEntry() {
        sync([...entries, ["", parsedValue.base === "number" ? 0 : ""]]);
    }

    function removeEntry(index) {
        sync(entries.filter((_, i) => i !== index));
    }
</script>

<div class="map-editor">
    {#each entries as [k, v], i}
        <div class="map-row">
            <div class="map-key">
                {#if parsedKey.kind === "fk"}
                    {#if k}
                        <FKButton
                            id={k}
                            targetTable={parsedKey.target}
                            displayText={keyDisplayMap.get(k) || k}
                            onOpen={(t, id) => onOpenFK?.(t, id)}
                            removable
                            onRemove={() => removeEntry(i)}
                        />
                    {:else}
                        <FKEditor
                            value={k}
                            targetTable={parsedKey.target}
                            tableConfig={tableConfig}
                            onChange={(nv) => updateKey(i, nv)}
                            {onOpenFK}
                        />
                    {/if}
                {:else if parsedKey.kind === "enum"}
                    <EnumEditor value={k} options={enums?.[parsedKey.name] ?? []} onChange={(nv) => updateKey(i, nv)} />
                {:else}
                    <StringEditor value={k} onChange={(nv) => updateKey(i, nv)} />
                {/if}
            </div>
            <span class="map-arrow">→</span>
            <div class="map-val">
                {#if parsedValue.base === "number"}
                    <NumberEditor value={v ?? 0} onChange={(nv) => updateValue(i, nv)} />
                {:else}
                    <StringEditor value={v ?? ""} onChange={(nv) => updateValue(i, nv)} />
                {/if}
            </div>
            {#if parsedKey.kind !== "fk" || !k}
                <button class="map-remove" onclick={() => removeEntry(i)}>×</button>
            {/if}
        </div>
    {/each}
    <button class="map-add" onclick={addEntry}>+ Add entry</button>
</div>

<style>
    .map-editor {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .map-row {
        display: flex;
        align-items: center;
        gap: 4px;
    }
    .map-key {
        flex: 1;
        min-width: 0;
    }
    .map-arrow {
        color: var(--text-muted);
        font-size: 12px;
        flex-shrink: 0;
    }
    .map-val {
        flex: 1;
        min-width: 0;
    }
    .map-remove {
        background: none;
        border: 1px solid var(--border);
        border-radius: 4px;
        color: var(--text-muted);
        cursor: pointer;
        padding: 0 6px;
        font-size: 14px;
        flex-shrink: 0;
    }
    .map-remove:hover {
        color: var(--error);
        border-color: var(--error);
    }
    .map-add {
        background: none;
        border: 1px dashed var(--border);
        border-radius: 4px;
        color: var(--text-muted);
        cursor: pointer;
        padding: 4px 8px;
        font-size: 12px;
        text-align: center;
    }
    .map-add:hover {
        color: var(--accent);
        border-color: var(--accent);
    }
</style>
