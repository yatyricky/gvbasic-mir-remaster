<script>
    import { searchFK } from "../../lib/api-client.js";
    import FKButton from "./FKButton.svelte";

    /**
     * @type {{
     *   value: string[],
     *   targetTable: string,
     *   tableConfig?: any,
     *   onChange: (v: string[]) => void,
     *   onOpenFK?: (table: string, id: string) => void
     * }}
     */
    let { value, targetTable, tableConfig, onChange, onOpenFK } = $props();

    let items = $state(value ? [...value] : []);
    let query = $state("");
    let results = $state([]);
    let open = $state(false);
    let displayMap = $state(new Map());

    // Sync from parent
    $effect(() => {
        if (value) items = [...value];
    });

    // Resolve all display texts
    $effect(() => {
        if (items.length === 0) return;
        searchFK(targetTable, "").then(all => {
            const map = new Map();
            for (const r of all) map.set(r.id, r.display);
            displayMap = map;
        });
    });

    let debounceTimer;
    function onSearch(e) {
        query = e.currentTarget.value;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            if (query.length > 0) {
                results = await searchFK(targetTable, query);
                open = true;
            } else {
                results = [];
                open = false;
            }
        }, 200);
    }

    function add(id) {
        if (items.includes(id)) return;
        const next = [...items, id];
        items = next;
        onChange(next);
        query = "";
        results = [];
        open = false;
    }

    function remove(id) {
        const next = items.filter(x => x !== id);
        items = next;
        onChange(next);
    }

    function onBlur() {
        setTimeout(() => open = false, 200);
    }
</script>

<div class="fk-array">
    <div class="tags">
        {#each items as id}
            <FKButton
                {id}
                {targetTable}
                displayText={displayMap.get(id) || id}
                onOpen={(t, i) => onOpenFK?.(t, i)}
                onRemove={() => remove(id)}
                removable
            />
        {/each}
    </div>
    <div class="search-row">
        <input
            type="text"
            class="search-input"
            value={query}
            oninput={onSearch}
            onblur={onBlur}
            placeholder="Add {targetTable}..."
        />
    </div>
    {#if open && results.length > 0}
        <div class="dropdown">
            {#each results as r}
                <button class="option" onmousedown={() => add(r.id)}>
                    <span class="opt-id">{r.id}</span>
                    <span class="opt-display">{r.display}</span>
                </button>
            {/each}
        </div>
    {/if}
</div>

<style>
    .fk-array {
        position: relative;
    }
    .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-bottom: 4px;
    }
    .search-input {
        width: 100%;
        padding: 4px 8px;
        background: var(--bg-primary);
        border: 1px solid var(--border);
        border-radius: 4px;
        color: var(--text-primary);
        font-size: 12px;
        outline: none;
    }
    .search-input:focus {
        border-color: var(--accent);
    }
    .dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--bg-surface);
        border: 1px solid var(--border);
        border-radius: 4px;
        margin-top: 2px;
        max-height: 200px;
        overflow-y: auto;
        z-index: 100;
    }
    .option {
        display: flex;
        gap: 8px;
        width: 100%;
        padding: 6px 8px;
        border: none;
        background: none;
        color: var(--text-primary);
        cursor: pointer;
        text-align: left;
        font-size: 12px;
    }
    .option:hover {
        background: var(--bg-hover);
    }
    .opt-id {
        color: var(--text-muted);
        font-family: monospace;
        min-width: 60px;
    }
</style>
