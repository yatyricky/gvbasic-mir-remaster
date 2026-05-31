<script>
    /** @type {{ value: string, onChange: (v: string) => void }} */
    let { value, onChange } = $props();
</script>

<input
    type="text"
    class="editor-input"
    {value}
    oninput={(e) => onChange(e.currentTarget.value)}
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
    }
    .editor-input:focus {
        border-color: var(--accent);
    }
</style>
