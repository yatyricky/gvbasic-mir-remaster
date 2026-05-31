<script>
    /** @type {{ value: string, tables: string[], enums: string[], onChange: (v: string) => void }} */
    let { value, tables, enums, onChange } = $props();

    let category = $state("primitive"); // primitive | enum | fk | map
    let isArray = $state(false);
    let selectedPrimitive = $state("string");
    let mapKeyType = $state("string");
    let mapValueType = $state("string");
    let selectedEnum = $state("");
    let selectedFK = $state("");

    // Parse current value on mount
    $effect(() => {
        const v = value || "";
        isArray = v.endsWith("[]");
        const base = isArray ? v.slice(0, -2) : v;

        if (base.startsWith("Map<")) {
            category = "map";
            const inner = base.slice(4, -1);
            const parts = inner.split(",").map(s => s.trim());
            mapKeyType = parts[0] || "string";
            mapValueType = parts[1] || "string";
        } else if (base.startsWith("Enum:")) {
            category = "enum";
            selectedEnum = base.slice(5);
        } else if (base.startsWith("FK:")) {
            category = "fk";
            selectedFK = base.slice(3);
        } else {
            category = "primitive";
            selectedPrimitive = base || "string";
        }
    });

    function emit() {
        let type = "";
        if (category === "primitive") {
            type = selectedPrimitive;
        } else if (category === "enum") {
            type = `Enum:${selectedEnum}`;
        } else if (category === "fk") {
            type = `FK:${selectedFK}`;
        } else if (category === "map") {
            type = `Map<${mapKeyType}, ${mapValueType}>`;
        }
        if (isArray) type += "[]";
        onChange(type);
    }

    function onPrimitiveChange(e) {
        selectedPrimitive = e.currentTarget.value;
        emit();
    }

    function onCategoryChange(e) {
        category = e.currentTarget.value;
        emit();
    }

    function onArrayToggle(e) {
        isArray = e.currentTarget.checked;
        emit();
    }

    function onEnumChange(e) {
        selectedEnum = e.currentTarget.value;
        emit();
    }

    function onFKChange(e) {
        selectedFK = e.currentTarget.value;
        emit();
    }

    function onMapKeyChange(e) {
        mapKeyType = e.currentTarget.value;
        emit();
    }

    function onMapValueChange(e) {
        mapValueType = e.currentTarget.value;
        emit();
    }
</script>

<div class="type-picker">
    <div class="row">
        <select class="select" value={category} onchange={onCategoryChange}>
            <option value="primitive">Primitive</option>
            <option value="enum">Enum</option>
            <option value="fk">FK</option>
            <option value="map">Map</option>
        </select>

        {#if category === "primitive"}
            <select class="select" value={selectedPrimitive} onchange={onPrimitiveChange}>
                <option value="string">string</option>
                <option value="number">number</option>
                <option value="boolean">boolean</option>
            </select>
        {:else if category === "enum"}
            <select class="select" value={selectedEnum} onchange={onEnumChange}>
                <option value="">-- select --</option>
                {#each enums as e}
                    <option value={e}>{e}</option>
                {/each}
            </select>
        {:else if category === "fk"}
            <select class="select" value={selectedFK} onchange={onFKChange}>
                <option value="">-- select --</option>
                {#each tables as t}
                    <option value={t}>{t}</option>
                {/each}
            </select>
        {:else if category === "map"}
            <span class="map-label">Map&lt;</span>
            <select class="select narrow" value={mapKeyType} onchange={onMapKeyChange}>
                <option value="string">string</option>
                {#each enums as e}
                    <option value={`Enum:${e}`}>Enum:{e}</option>
                {/each}
                {#each tables as t}
                    <option value={`FK:${t}`}>FK:{t}</option>
                {/each}
            </select>
            <span class="map-label">,</span>
            <select class="select narrow" value={mapValueType} onchange={onMapValueChange}>
                <option value="number">number</option>
                <option value="string">string</option>
            </select>
            <span class="map-label">&gt;</span>
        {/if}

        <label class="array-toggle">
            <input type="checkbox" checked={isArray} onchange={onArrayToggle} />
            <span>[]</span>
        </label>
    </div>
    <div class="preview">{value}</div>
</div>

<style>
    .type-picker {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .row {
        display: flex;
        align-items: center;
        gap: 4px;
    }
    .select {
        padding: 4px 8px;
        background: var(--bg-primary);
        border: 1px solid var(--border);
        border-radius: 4px;
        color: var(--text-primary);
        font-size: 12px;
        outline: none;
    }
    .select.narrow {
        max-width: 100px;
    }
    .map-label {
        color: var(--text-muted);
        font-size: 12px;
    }
    .array-toggle {
        display: flex;
        align-items: center;
        gap: 4px;
        color: var(--text-secondary);
        font-size: 12px;
        cursor: pointer;
    }
    .array-toggle input {
        accent-color: var(--accent);
    }
    .preview {
        color: var(--text-muted);
        font-size: 11px;
        font-family: monospace;
    }
</style>
