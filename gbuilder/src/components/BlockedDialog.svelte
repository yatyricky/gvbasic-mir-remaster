<script>
    /** @type {{ title: string, message: string, details: string[], onClose: () => void }} */
    let { title, message, details, onClose } = $props();
</script>

<div class="overlay" onclick={onClose}>
    <div class="dialog" onclick={(e) => e.stopPropagation()}>
        <div class="dialog-title">{title}</div>
        <div class="dialog-message">{message}</div>
        <div class="dialog-details">
            {#each details as d}
                <div class="detail-item">{d}</div>
            {/each}
        </div>
        <div class="dialog-actions">
            <button class="dialog-btn" onclick={onClose}>Close</button>
        </div>
    </div>
</div>

<style>
    .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    .dialog {
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 20px;
        min-width: 400px;
        max-width: 560px;
        box-shadow: 0 12px 40px rgba(0,0,0,0.5);
    }
    .dialog-title {
        font-size: 16px;
        font-weight: 700;
        color: var(--error);
        margin-bottom: 8px;
    }
    .dialog-message {
        font-size: 13px;
        color: var(--text-secondary);
        line-height: 1.5;
        margin-bottom: 12px;
    }
    .dialog-details {
        max-height: 300px;
        overflow-y: auto;
        background: var(--bg-primary);
        border: 1px solid var(--border);
        border-radius: 6px;
        padding: 8px;
        margin-bottom: 16px;
    }
    .detail-item {
        font-size: 12px;
        font-family: monospace;
        color: var(--text-muted);
        padding: 2px 0;
        border-bottom: 1px solid var(--bg-surface);
    }
    .detail-item:last-child {
        border-bottom: none;
    }
    .dialog-actions {
        display: flex;
        justify-content: flex-end;
    }
    .dialog-btn {
        padding: 6px 20px;
        border: 1px solid var(--border);
        border-radius: 6px;
        background: var(--bg-surface);
        color: var(--text-primary);
        cursor: pointer;
        font-size: 13px;
    }
    .dialog-btn:hover {
        background: var(--bg-hover);
    }
</style>
