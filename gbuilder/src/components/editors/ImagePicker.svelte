<script>
    import { listImages } from "../../lib/api-client.js";

    /** @type {{ value: string, imageBase: string, onChange: (v: string) => void }} */
    let { value, imageBase, onChange } = $props();

    let open = $state(false);
    let images = $state([]);
    let loading = $state(false);
    let filter = $state("");

    let filtered = $derived(
        filter ? images.filter(i => i.toLowerCase().includes(filter.toLowerCase())) : images
    );

    async function toggle() {
        open = !open;
        if (open && images.length === 0 && imageBase) {
            loading = true;
            try {
                images = await listImages(imageBase);
            } catch { images = []; }
            loading = false;
        }
    }

    function select(name) {
        onChange(name);
        open = false;
        filter = "";
    }

    function clear() {
        onChange("");
        open = false;
    }

    function onWindowClick(e) {
        if (!e.target.closest('.img-picker')) open = false;
    }
</script>

<svelte:window onclick={onWindowClick} />

<div class="img-picker">
    <div class="picker-row">
        {#if value}
            {@const src = `/api/image?path=${encodeURIComponent(`${imageBase}/${value}`)}`}
            <button class="picker-trigger" onclick={toggle} title={value}>
                <img class="picker-thumb" {src} alt={value} />
            </button>
            <button class="picker-clear" onclick={clear}>×</button>
        {:else}
            <button class="picker-empty" onclick={toggle}>
                {loading ? "Loading..." : "Select image..."}
            </button>
        {/if}
    </div>

    {#if open}
        <div class="dropdown" role="presentation" onclick={(e) => e.stopPropagation()}>
            <input
                type="text"
                class="dd-filter"
                placeholder="Filter..."
                value={filter}
                oninput={(e) => filter = e.currentTarget.value}
            />
            <div class="dd-grid">
                {#each filtered as name}
                    {@const src = `/api/image?path=${encodeURIComponent(`${imageBase}/${name}`)}`}
                    <button
                        class="dd-item"
                        class:selected={name === value}
                        onclick={() => select(name)}
                        title={name}
                    >
                        <img class="dd-thumb" {src} alt={name} />
                    </button>
                {/each}
                {#if filtered.length === 0 && !loading}
                    <div class="dd-empty">No images found</div>
                {/if}
            </div>
        </div>
    {/if}
</div>

<style>
    .img-picker {
        position: relative;
    }
    .picker-row {
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .picker-trigger {
        background: var(--bg-primary);
        border: 1px solid var(--border);
        border-radius: 4px;
        padding: 2px;
        cursor: pointer;
    }
    .picker-trigger:hover {
        border-color: var(--accent);
    }
    .picker-thumb {
        display: block;
        width: 32px;
        height: 32px;
        object-fit: contain;
        border-radius: 2px;
    }
    .picker-clear {
        background: none;
        border: 1px solid var(--border);
        border-radius: 4px;
        color: var(--text-muted);
        cursor: pointer;
        padding: 0 6px;
        font-size: 14px;
    }
    .picker-clear:hover {
        color: var(--error);
        border-color: var(--error);
    }
    .picker-empty {
        background: var(--bg-primary);
        border: 1px dashed var(--border);
        border-radius: 4px;
        color: var(--text-muted);
        cursor: pointer;
        padding: 6px 12px;
        font-size: 12px;
    }
    .picker-empty:hover {
        border-color: var(--accent);
        color: var(--text-primary);
    }
    .dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        width: 280px;
        max-height: 360px;
        background: var(--bg-surface);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 6px;
        z-index: 200;
        box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    .dd-filter {
        padding: 5px 8px;
        background: var(--bg-primary);
        border: 1px solid var(--border);
        border-radius: 4px;
        color: var(--text-primary);
        font-size: 12px;
        outline: none;
    }
    .dd-filter:focus {
        border-color: var(--accent);
    }
    .dd-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        overflow-y: auto;
        max-height: 300px;
    }
    .dd-item {
        background: var(--bg-primary);
        border: 2px solid transparent;
        border-radius: 4px;
        padding: 2px;
        cursor: pointer;
        flex-shrink: 0;
    }
    .dd-item:hover {
        border-color: var(--accent);
    }
    .dd-item.selected {
        border-color: var(--accent);
        box-shadow: 0 0 0 1px var(--accent);
    }
    .dd-thumb {
        display: block;
        width: 32px;
        height: 32px;
        object-fit: contain;
        border-radius: 2px;
    }
    .dd-empty {
        padding: 12px;
        color: var(--text-muted);
        font-size: 12px;
        text-align: center;
        width: 100%;
    }
</style>
