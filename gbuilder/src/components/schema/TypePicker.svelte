<script>
    /** @type {{ value: string, tables: string[], enums: string[], onChange: (v: string) => void, onImageBaseChange?: (v: string) => void, imageBase?: string }} */
    let { value, tables, enums, onChange, onImageBaseChange, imageBase } = $props();

    // Categories: primitive | enum | fk | list | map | image
    let category = $state("primitive");
    let selectedPrimitive = $state("string");
    let selectedEnum = $state("");
    let selectedFK = $state("");
    let listElemType = $state("string");
    let mapKeyType = $state("string");
    let mapValueType = $state("number");

    // Parse current value
    $effect(() => {
        const v = value || "";

        if (v.startsWith("Map<")) {
            category = "map";
            const inner = v.slice(4, -1);
            const parts = inner.split(",").map(s => s.trim());
            mapKeyType = parts[0] || "string";
            mapValueType = parts[1] || "number";
        } else if (v.endsWith("[]")) {
            const base = v.slice(0, -2);
            if (base.startsWith("Enum:")) {
                category = "list";
                listElemType = base;
            } else if (base.startsWith("FK:")) {
                category = "list";
                listElemType = base;
            } else {
                category = "list";
                listElemType = base;
            }
        } else if (v.startsWith("Enum:")) {
            category = "enum";
            selectedEnum = v.slice(5);
        } else if (v.startsWith("FK:")) {
            category = "fk";
            selectedFK = v.slice(3);
        } else if (v === "image") {
            category = "image";
        } else {
            category = "primitive";
            selectedPrimitive = v || "string";
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
        } else if (category === "list") {
            type = `${listElemType}[]`;
        } else if (category === "map") {
            type = `Map<${mapKeyType}, ${mapValueType}>`;
        } else if (category === "image") {
            type = "image";
        }
        onChange(type);
    }

    function onCategoryChange(e) {
        category = e.currentTarget.value;
        // Set sensible defaults for each category
        if (category === "list" && !listElemType) listElemType = "string";
        emit();
    }
</script>

<div class="type-picker">
    <div class="row">
        <select class="select" value={category} onchange={onCategoryChange}>
            <option value="primitive">Primitive</option>
            <option value="enum">Enum</option>
            <option value="fk">FK</option>
            <option value="list">List</option>
            <option value="map">Map</option>
            <option value="image">Image</option>
        </select>

        {#if category === "primitive"}
            <select class="select" value={selectedPrimitive} onchange={(e) => { selectedPrimitive = e.currentTarget.value; emit(); }}>
                <option value="string">string</option>
                <option value="number">number</option>
                <option value="boolean">boolean</option>
            </select>

        {:else if category === "enum"}
            <select class="select" value={selectedEnum} onchange={(e) => { selectedEnum = e.currentTarget.value; emit(); }}>
                <option value="">-- select --</option>
                {#each enums as e}
                    <option value={e}>{e}</option>
                {/each}
            </select>

        {:else if category === "fk"}
            <select class="select" value={selectedFK} onchange={(e) => { selectedFK = e.currentTarget.value; emit(); }}>
                <option value="">-- select --</option>
                {#each tables as t}
                    <option value={t}>{t}</option>
                {/each}
            </select>

        {:else if category === "list"}
            <span class="label">List&lt;</span>
            <select class="select narrow" value={listElemType} onchange={(e) => { listElemType = e.currentTarget.value; emit(); }}>
                <option value="string">string</option>
                <option value="number">number</option>
                {#each enums as e}
                    <option value={`Enum:${e}`}>Enum:{e}</option>
                {/each}
                {#each tables as t}
                    <option value={`FK:${t}`}>FK:{t}</option>
                {/each}
            </select>
            <span class="label">&gt;</span>

        {:else if category === "map"}
            <span class="label">Map&lt;</span>
            <select class="select narrow" value={mapKeyType} onchange={(e) => { mapKeyType = e.currentTarget.value; emit(); }}>
                <option value="string">string</option>
                <option value="number">number</option>
                {#each enums as e}
                    <option value={`Enum:${e}`}>Enum:{e}</option>
                {/each}
                {#each tables as t}
                    <option value={`FK:${t}`}>FK:{t}</option>
                {/each}
            </select>
            <span class="label">,</span>
            <select class="select narrow" value={mapValueType} onchange={(e) => { mapValueType = e.currentTarget.value; emit(); }}>
                <option value="number">number</option>
                <option value="string">string</option>
            </select>
            <span class="label">&gt;</span>

        {:else if category === "image"}
            <input
                type="text"
                class="img-input"
                placeholder="e.g. ./assets/images"
                value={imageBase || ""}
                oninput={(e) => onImageBaseChange?.(e.currentTarget.value)}
            />
            <span class="hint">(relative to project.json)</span>
        {/if}
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
    .select:focus {
        border-color: var(--accent);
    }
    .select.narrow {
        max-width: 120px;
    }
    .label {
        color: var(--text-muted);
        font-size: 12px;
        flex-shrink: 0;
    }
    .img-input {
        padding: 4px 8px;
        background: var(--bg-primary);
        border: 1px solid var(--border);
        border-radius: 4px;
        color: var(--text-primary);
        font-size: 12px;
        font-family: monospace;
        outline: none;
        width: 140px;
    }
    .img-input:focus {
        border-color: var(--accent);
    }
    .preview {
        color: var(--text-muted);
        font-size: 11px;
        font-family: monospace;
    }
    .hint {
        color: var(--text-muted);
        font-size: 10px;
        white-space: nowrap;
    }
</style>
