<script>
    /** @type {{ value: number, onChange: (v: number) => void }} */
    let { value, onChange } = $props();
</script>

<input
    type="number"
    class="editor-input"
    {value}
    oninput={(e) => onChange(Number(e.currentTarget.value))}
/>

<style>
    .editor-input {
        width: 100%;
        padding: 4px 8px;
        background: var(--bg-primary);
        border: 1px solid var(--border);
        border-radius: 4px;
        color: var(--text-primary);
        font-size: 13px;
        outline: none;
        font-variant-numeric: tabular-nums;
    }
    .editor-input:focus {
        border-color: var(--accent);
    }
</style>
