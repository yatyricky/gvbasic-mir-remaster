<script>
    import { searchFK } from "../../lib/api-client.js";
    import { getRowDisplay } from "../../lib/template.js";
    import FKButton from "./FKButton.svelte";

    /**
     * @type {{
     *   value: string,
     *   targetTable: string,
     *   tableConfig?: any,
     *   onChange: (v: string) => void,
     *   onOpenFK?: (table: string, id: string) => void
     * }}
     */
    let { value, targetTable, tableConfig, onChange, onOpenFK } = $props();

    let query = $state("");
    let results = $state([]);
    let open = $state(false);
    let displayText = $state("");

    // Sync from parent
    $effect(() => {
        displayText = value || "";
    });

    // Resolve current value display
    $effect(() => {
        if (value) {
            searchFK(targetTable, value).then(r => {
                const match = r.find(x => x.id === value);
                if (match) displayText = match.display;
            });
        } else {
            displayText = "";
        }
    });

    let debounceTimer;
    function onInput(e) {
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

    function pick(id, display) {
        onChange(id);
        displayText = display;
        open = false;
        query = "";
    }

    function clear() {
        onChange("");
        displayText = "";
        query = "";
        open = false;
    }

    function onFocus() {
        if (results.length > 0) open = true;
    }

    function onBlur() {
        setTimeout(() => open = false, 200);
    }
</script>

<div class="fk-editor">
    {#if value}
        <div class="fk-current">
            <FKButton
                id={value}
                {targetTable}
                {displayText}
                onOpen={(t, id) => onOpenFK?.(t, id)}
            />
            <button class="fk-change" onclick={clear}>change</button>
        </div>
    {:else}
        <div class="fk-search">
            <input
                type="text"
                class="fk-input"
                value={query}
                oninput={onInput}
                onfocus={onFocus}
                onblur={onBlur}
                placeholder="Search {targetTable}..."
            />
        </div>
    {/if}
    {#if open && results.length > 0}
        <div class="fk-dropdown">
            {#each results as r}
                <button class="fk-option" onmousedown={() => pick(r.id, r.display)}>
                    <span class="fk-id">{r.id}</span>
                    <span class="fk-display">{r.display}</span>
                </button>
            {/each}
        </div>
    {/if}
</div>

<style>
    .fk-editor {
        position: relative;
    }
    .fk-current {
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .fk-change {
        background: none;
        border: 1px solid var(--border);
        border-radius: 4px;
        color: var(--text-muted);
        cursor: pointer;
        padding: 2px 8px;
        font-size: 11px;
    }
    .fk-change:hover {
        color: var(--accent);
        border-color: var(--accent);
    }
    .fk-input {
        width: 100%;
        padding: 4px 8px;
        background: var(--bg-primary);
        border: 1px solid var(--border);
        border-radius: 4px;
        color: var(--text-primary);
        font-size: 12px;
        outline: none;
    }
    .fk-input:focus {
        border-color: var(--accent);
    }
    .fk-dropdown {
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
    .fk-option {
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
    .fk-option:hover {
        background: var(--bg-hover);
    }
    .fk-id {
        color: var(--text-muted);
        font-family: monospace;
        min-width: 60px;
    }
    .fk-display {
        color: var(--text-primary);
    }
</style>
