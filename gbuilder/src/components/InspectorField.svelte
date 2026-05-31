<script>
    import { parseType } from "../lib/type-parser.js";
    import StringEditor from "./editors/StringEditor.svelte";
    import NumberEditor from "./editors/NumberEditor.svelte";
    import BoolEditor from "./editors/BoolEditor.svelte";
    import EnumEditor from "./editors/EnumEditor.svelte";
    import FKEditor from "./editors/FKEditor.svelte";
    import FKArrayEditor from "./editors/FKArrayEditor.svelte";
    import MapEditor from "./editors/MapEditor.svelte";
    import ArrayOfMapEditor from "./editors/ArrayOfMapEditor.svelte";
    import ArrayEditor from "./editors/ArrayEditor.svelte";

    /**
     * @type {{
     *   column: {name: string, type: string, imageBase?: string},
     *   value: any,
     *   onChange: (v: any) => void,
     *   enums?: Record<string, string[]>,
     *   project?: any,
     *   onOpenFK?: (table: string, id: string) => void,
     *   linkedColumn?: {name: string, value: any, onChange: (v: any) => void}
     * }}
     */
    let { column, value, onChange, enums, project, onOpenFK, linkedColumn } = $props();

    let parsed = $derived(parseType(column.type));

    function getTableConfig(tableName) {
        return project?.tables?.[tableName];
    }

    function formatDisplay(val) {
        if (val == null) return "null";
        if (typeof val === "object") return JSON.stringify(val);
        return String(val);
    }
</script>

<div class="field">
    <div class="field-header">
        <span class="field-name">{column.name}</span>
        <span class="field-type">{column.type}</span>
    </div>
    <div class="field-editor">
        {#if parsed.kind === "primitive"}
            {#if parsed.base === "string"}
                <StringEditor value={value ?? ""} {onChange} />
            {:else if parsed.base === "number"}
                <NumberEditor value={value ?? 0} {onChange} />
            {:else if parsed.base === "boolean"}
                <BoolEditor value={value ?? false} {onChange} />
            {/if}
        {:else if parsed.kind === "enum"}
            <EnumEditor value={value ?? ""} options={enums?.[parsed.name] ?? []} {onChange} />
        {:else if parsed.kind === "fk"}
            <FKEditor
                value={value ?? ""}
                targetTable={parsed.target}
                tableConfig={getTableConfig(parsed.target)}
                {onChange}
                {onOpenFK}
            />
        {:else if parsed.kind === "array" && parsed.element.kind === "fk"}
            <FKArrayEditor
                value={value ?? []}
                targetTable={parsed.element.target}
                tableConfig={getTableConfig(parsed.element.target)}
                {onChange}
                {onOpenFK}
            />
        {:else if parsed.kind === "array" && parsed.element.kind === "enum"}
            <ArrayEditor value={value ?? []} elementType={column.type.slice(0, -2)} {onChange} {enums} />
        {:else if parsed.kind === "array" && parsed.element.kind === "primitive"}
            <ArrayEditor value={value ?? []} elementType={column.type.slice(0, -2)} {onChange} {enums} />
        {:else if parsed.kind === "array" && parsed.element.kind === "map"}
            <ArrayOfMapEditor
                value={value ?? []}
                keyType={column.type.slice(0, -2).replace("Map<", "").split(",")[0].trim()}
                valueType={column.type.slice(0, -2).replace("Map<", "").split(",")[1].replace(">", "").trim()}
                {onChange}
                {enums}
                {onOpenFK}
                tableConfig={parsed.element.key.kind === "fk" ? getTableConfig(parsed.element.key.target) : undefined}
                linkedField={linkedColumn?.name}
                linkedValue={linkedColumn?.value}
                onLinkedChange={linkedColumn?.onChange}
            />
        {:else if parsed.kind === "map"}
            <MapEditor
                value={value ?? {}}
                keyType={column.type.replace("Map<", "").split(",")[0].trim()}
                valueType={column.type.replace("Map<", "").split(",")[1].replace(">", "").trim()}
                {onChange}
                {enums}
                {onOpenFK}
                tableConfig={parsed.key.kind === "fk" ? getTableConfig(parsed.key.target) : undefined}
            />
        {:else}
            <div class="field-readonly">{formatDisplay(value)}</div>
        {/if}
    </div>
</div>

<style>
    .field {
        padding: 8px 0;
        border-bottom: 1px solid var(--border);
    }
    .field-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
    }
    .field-name {
        color: var(--text-secondary);
        font-size: 11px;
        text-transform: uppercase;
    }
    .field-type {
        color: var(--text-muted);
        font-size: 10px;
        font-family: monospace;
    }
    .field-readonly {
        padding: 4px 8px;
        background: var(--bg-primary);
        border: 1px solid var(--border);
        border-radius: 4px;
        color: var(--text-muted);
        font-size: 12px;
        word-break: break-all;
    }
</style>
