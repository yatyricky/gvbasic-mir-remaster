<script>
    import MapEditor from "./MapEditor.svelte";
    import NumberEditor from "./NumberEditor.svelte";

    /**
     * @type {{
     *   value: Record<string, any>[],
     *   keyType: string,
     *   valueType: string,
     *   onChange: (v: Record<string, any>[]) => void,
     *   enums?: Record<string, string[]>,
     *   onOpenFK?: (table: string, id: string) => void,
     *   tableConfig?: any,
     *   linkedField?: string,
     *   linkedValue?: number[],
     *   onLinkedChange?: (v: number[]) => void
     * }}
     */
    let { value, keyType, valueType, onChange, enums, onOpenFK, tableConfig, linkedField, linkedValue, onLinkedChange } = $props();

    let pools = $state(value ? [...value.map(p => ({ ...p }))] : []);
    let counts = $state(linkedValue ? [...linkedValue] : []);

    function syncPools(newPools) {
        pools = newPools;
        onChange(newPools.map(p => ({ ...p })));
        // Sync linked field (e.g. randomAffixCount)
        if (onLinkedChange) {
            const newCounts = [];
            for (let i = 0; i < newPools.length; i++) {
                newCounts.push(counts[i] ?? 1);
            }
            counts = newCounts;
            onLinkedChange(newCounts);
        }
    }

    function updatePool(index, mapValue) {
        const next = [...pools];
        next[index] = mapValue;
        syncPools(next);
    }

    function updateCount(index, val) {
        const next = [...counts];
        next[index] = val;
        counts = next;
        if (onLinkedChange) onLinkedChange(next);
    }

    function addPool() {
        syncPools([...pools, {}]);
        counts = [...counts, 1];
        if (onLinkedChange) onLinkedChange(counts);
    }

    function removePool(index) {
        syncPools(pools.filter((_, i) => i !== index));
        counts = counts.filter((_, i) => i !== index);
        if (onLinkedChange) onLinkedChange(counts);
    }
</script>

<div class="aom-editor">
    {#each pools as pool, i}
        <div class="pool">
            <div class="pool-header">
                <span class="pool-title">Pool {i + 1}</span>
                {#if linkedField}
                    <span class="pool-count-label">{linkedField}:</span>
                    <div class="pool-count-input">
                        <NumberEditor value={counts[i] ?? 1} onChange={(v) => updateCount(i, v)} />
                    </div>
                {/if}
                <button class="pool-remove" onclick={() => removePool(i)}>Remove Pool</button>
            </div>
            <div class="pool-body">
                <MapEditor
                    value={pool}
                    {keyType}
                    {valueType}
                    onChange={(v) => updatePool(i, v)}
                    {enums}
                    {onOpenFK}
                    {tableConfig}
                />
            </div>
        </div>
    {/each}
    <button class="pool-add" onclick={addPool}>+ Add Pool</button>
</div>

<style>
    .aom-editor {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .pool {
        border: 1px solid var(--border);
        border-radius: 6px;
        overflow: hidden;
    }
    .pool-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 10px;
        background: var(--bg-primary);
        border-bottom: 1px solid var(--border);
    }
    .pool-title {
        color: var(--accent);
        font-size: 12px;
        font-weight: 600;
    }
    .pool-count-label {
        color: var(--text-muted);
        font-size: 11px;
        margin-left: auto;
    }
    .pool-count-input {
        width: 60px;
    }
    .pool-remove {
        background: none;
        border: 1px solid var(--border);
        border-radius: 4px;
        color: var(--text-muted);
        cursor: pointer;
        padding: 2px 8px;
        font-size: 11px;
    }
    .pool-remove:hover {
        color: var(--error);
        border-color: var(--error);
    }
    .pool-body {
        padding: 8px;
    }
    .pool-add {
        background: none;
        border: 1px dashed var(--border);
        border-radius: 6px;
        color: var(--text-muted);
        cursor: pointer;
        padding: 8px;
        font-size: 12px;
        text-align: center;
    }
    .pool-add:hover {
        color: var(--accent);
        border-color: var(--accent);
    }
</style>
