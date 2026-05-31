<script>
    import { parseType } from "../lib/type-parser.js";
    import { getEnumEntries } from "../lib/enum-utils.js";

    /**
     * @type {{
     *   column: {name: string, displayName?: string, type: string},
     *   sortDir: 'asc'|'desc'|null,
     *   filter: any,
     *   enums?: Record<string, any>,
     *   onSort: (dir: 'asc'|'desc'|null) => void,
     *   onFilter: (value: any) => void
     * }}
     */
    let { column, sortDir, filter, enums, onSort, onFilter } = $props();

    let open = $state(false);
    let parsed = $derived(parseType(column.type));

    function toggle() {
        open = !open;
    }

    function close() {
        open = false;
    }

    function handleSort(dir) {
        onSort(sortDir === dir ? null : dir);
    }

    function clearFilter() {
        onFilter(null);
    }

    // Close on outside click
    function onWindowClick(e) {
        if (!e.target.closest('.col-header-wrap')) {
            open = false;
        }
    }
</script>

<svelte:window onclick={onWindowClick} />

<div class="col-header-wrap">
    <button class="col-header-btn" class:active={sortDir || filter} onclick={toggle}>
        <span class="col-label">{column.displayName || column.name}</span>
        {#if sortDir}
            <span class="sort-icon">{sortDir === 'asc' ? '↑' : '↓'}</span>
        {/if}
        {#if filter}
            <span class="filter-dot"></span>
        {/if}
    </button>
    {#if open}
        <div class="dropdown" onclick={(e) => e.stopPropagation()}>
            <div class="dd-section">
                <button class="dd-btn" class:selected={sortDir === 'asc'} onclick={() => handleSort('asc')}>↑ Ascending</button>
                <button class="dd-btn" class:selected={sortDir === 'desc'} onclick={() => handleSort('desc')}>↓ Descending</button>
            </div>
            <div class="dd-divider"></div>
            <div class="dd-section">
                <div class="dd-label">Filter</div>
                {#if parsed.kind === "primitive" && parsed.base === "number"}
                    <input
                        type="text"
                        class="dd-input"
                        placeholder="e.g. 10-20 or 15"
                        value={filter || ""}
                        oninput={(e) => onFilter(e.currentTarget.value || null)}
                    />
                {:else if parsed.kind === "primitive" && parsed.base === "boolean"}
                    <div class="dd-tri">
                        <button class="dd-btn" class:selected={!filter} onclick={() => onFilter(null)}>All</button>
                        <button class="dd-btn" class:selected={filter === true} onclick={() => onFilter(true)}>✓ True</button>
                        <button class="dd-btn" class:selected={filter === false} onclick={() => onFilter(false)}>✗ False</button>
                    </div>
                {:else if parsed.kind === "enum"}
                    {@const entries = getEnumEntries(enums?.[parsed.name])}
                    <div class="dd-enum-list">
                        {#each entries as { value: opt, label }}
                            <label class="dd-enum-item">
                                <input
                                    type="checkbox"
                                    checked={Array.isArray(filter) && filter.includes(opt)}
                                    onchange={(e) => {
                                        const current = Array.isArray(filter) ? [...filter] : [];
                                        if (e.currentTarget.checked) {
                                            if (!current.includes(opt)) current.push(opt);
                                        } else {
                                            const idx = current.indexOf(opt);
                                            if (idx !== -1) current.splice(idx, 1);
                                        }
                                        onFilter(current.length > 0 ? current : null);
                                    }}
                                />
                                <span>{label}{label !== opt ? ` (${opt})` : ""}</span>
                            </label>
                        {/each}
                    </div>
                {:else}
                    <input
                        type="text"
                        class="dd-input"
                        placeholder="Search..."
                        value={typeof filter === 'string' ? filter : ""}
                        oninput={(e) => onFilter(e.currentTarget.value || null)}
                    />
                {/if}
            </div>
            {#if filter}
                <div class="dd-divider"></div>
                <button class="dd-btn clear" onclick={clearFilter}>✕ Clear Filter</button>
            {/if}
        </div>
    {/if}
</div>

<style>
    .col-header-wrap {
        position: relative;
    }
    .col-header-btn {
        display: flex;
        align-items: center;
        gap: 4px;
        width: 100%;
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 6px 8px;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        text-align: left;
    }
    .col-header-btn:hover {
        background: var(--bg-hover);
        color: var(--text-primary);
    }
    .col-header-btn.active {
        color: var(--accent);
    }
    .col-label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .sort-icon {
        font-size: 10px;
        flex-shrink: 0;
    }
    .filter-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--accent);
        flex-shrink: 0;
    }
    .dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        min-width: 200px;
        background: var(--bg-surface);
        border: 1px solid var(--border);
        border-radius: 6px;
        padding: 4px;
        z-index: 200;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    .dd-section {
        padding: 2px;
    }
    .dd-divider {
        height: 1px;
        background: var(--border);
        margin: 4px 0;
    }
    .dd-label {
        font-size: 10px;
        color: var(--text-muted);
        text-transform: uppercase;
        padding: 2px 6px;
        margin-bottom: 4px;
    }
    .dd-btn {
        display: block;
        width: 100%;
        padding: 5px 8px;
        background: none;
        border: none;
        border-radius: 4px;
        color: var(--text-primary);
        cursor: pointer;
        font-size: 12px;
        text-align: left;
    }
    .dd-btn:hover {
        background: var(--bg-hover);
    }
    .dd-btn.selected {
        color: var(--accent);
        background: rgba(137, 180, 250, 0.1);
    }
    .dd-btn.clear {
        color: var(--error);
    }
    .dd-btn.clear:hover {
        background: rgba(243, 139, 168, 0.1);
    }
    .dd-input {
        width: 100%;
        padding: 5px 8px;
        background: var(--bg-primary);
        border: 1px solid var(--border);
        border-radius: 4px;
        color: var(--text-primary);
        font-size: 12px;
        outline: none;
    }
    .dd-input:focus {
        border-color: var(--accent);
    }
    .dd-tri {
        display: flex;
        gap: 2px;
    }
    .dd-tri .dd-btn {
        flex: 1;
        text-align: center;
        font-size: 11px;
    }
    .dd-enum-list {
        max-height: 200px;
        overflow-y: auto;
    }
    .dd-enum-item {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 3px 6px;
        font-size: 12px;
        color: var(--text-primary);
        cursor: pointer;
    }
    .dd-enum-item:hover {
        background: var(--bg-hover);
        border-radius: 3px;
    }
    .dd-enum-item input {
        accent-color: var(--accent);
    }
</style>
