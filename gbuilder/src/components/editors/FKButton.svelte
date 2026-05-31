<script>
    /**
     * Unified FK control. A clickable button that shows resolved display text.
     * Works for single FK, FK array elements, and Map FK keys.
     *
     * @type {{
     *   id: string,
     *   targetTable: string,
     *   displayText: string,
     *   onOpen: (table: string, id: string) => void,
     *   onRemove?: () => void,
     *   removable?: boolean,
     *   active?: boolean
     * }}
     */
    let { id, targetTable, displayText, onOpen, onRemove, removable = false, active = false } = $props();
</script>

<span class="fk-btn" class:active>
    <button class="fk-trigger" onclick={() => onOpen(targetTable, id)} title="{targetTable}:{id}">
        {displayText || id}
    </button>
    {#if removable}
        <button class="fk-remove" onclick={onRemove}>×</button>
    {/if}
</span>

<style>
    .fk-btn {
        display: inline-flex;
        align-items: center;
        gap: 0;
        border: 1px solid var(--border);
        border-radius: 4px;
        overflow: hidden;
        vertical-align: middle;
    }
    .fk-btn.active {
        border-color: var(--accent);
        box-shadow: 0 0 0 1px var(--accent);
    }
    .fk-trigger {
        background: var(--bg-primary);
        border: none;
        color: var(--accent);
        cursor: pointer;
        padding: 2px 8px;
        font-size: 12px;
        white-space: nowrap;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .fk-trigger:hover {
        background: var(--bg-hover);
        color: var(--accent-hover);
    }
    .fk-remove {
        background: var(--bg-surface);
        border: none;
        border-left: 1px solid var(--border);
        color: var(--text-muted);
        cursor: pointer;
        padding: 2px 6px;
        font-size: 12px;
    }
    .fk-remove:hover {
        color: var(--error);
        background: var(--bg-hover);
    }
</style>
