<script>
    import { getEnumEntries } from "../../lib/enum-utils.js";

    /** @type {{ value: string, options: string[] | Record<string, string>, onChange: (v: string) => void }} */
    let { value, options, onChange } = $props();

    let entries = $derived(getEnumEntries(options));
</script>

<select class="editor-select" onchange={(e) => onChange(e.currentTarget.value)}>
    <option value="">-- select --</option>
    {#each entries as { value: v, label }}
        <option value={v} selected={value === v}>{label}{label !== v ? ` (${v})` : ""}</option>
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
