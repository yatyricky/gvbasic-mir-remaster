<script>
    /** @type {{ value: boolean, onChange: (v: boolean) => void }} */
    let { value, onChange } = $props();
</script>

<label class="toggle">
    <input
        type="checkbox"
        checked={value}
        onchange={(e) => onChange(e.currentTarget.checked)}
    />
    <span class="toggle-label">{value ? "✓ true" : "✗ false"}</span>
</label>

<style>
    .toggle {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
    }
    .toggle input {
        accent-color: var(--accent);
        width: 16px;
        height: 16px;
    }
    .toggle-label {
        color: var(--text-primary);
        font-size: 13px;
    }
</style>
