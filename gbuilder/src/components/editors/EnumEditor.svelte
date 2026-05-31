<script>
    /** @type {{ value: string, options: string[], onChange: (v: string) => void }} */
    let { value, options, onChange } = $props();
</script>

<select class="editor-select" onchange={(e) => onChange(e.currentTarget.value)}>
    <option value="">-- select --</option>
    {#each options as opt}
        <option value={opt} selected={value === opt}>{opt}</option>
    {/each}
</select>

<style>
    .editor-select {
        width: 100%;
        padding: 4px 8px;
        background: var(--bg-primary);
        border: 1px solid var(--border);
        border-radius: 4px;
        color: var(--text-primary);
        font-size: 13px;
        outline: none;
        cursor: pointer;
    }
    .editor-select:focus {
        border-color: var(--accent);
    }
    .editor-select option {
        background: var(--bg-primary);
        color: var(--text-primary);
    }
</style>
