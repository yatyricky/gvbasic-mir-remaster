<script>
    import { parseType } from "../lib/type-parser.js";

    /** @type {{ value: any, column: { name: string, type: string }, getFKDisplay?: (colName: string, id: string) => string|null }} */
    let { value, column, getFKDisplay } = $props();

    let parsed = $derived(parseType(column.type));

    function format(val, type) {
        if (val == null) return "";

        switch (type.kind) {
            case "primitive":
                if (type.base === "boolean") return val ? "✓" : "✗";
                return String(val);
            case "enum":
                return String(val);
            case "fk": {
                const resolved = getFKDisplay?.(column.name, String(val));
                return resolved ?? String(val);
            }
            case "array":
                if (Array.isArray(val)) {
                    if (val.length === 0) return "";
                    return val.map(v => {
                        if (type.element.kind === "fk") {
                            const resolved = getFKDisplay?.(column.name, String(v));
                            return resolved ?? String(v);
                        }
                        return format(v, type.element);
                    }).join(", ");
                }
                return String(val);
            case "map":
                if (typeof val === "object" && val !== null) {
                    const count = Object.keys(val).length;
                    return count === 0 ? "" : `{${count}}`;
                }
                return String(val);
            default:
                if (typeof val === "object") return JSON.stringify(val);
                return String(val);
        }
    }
</script>

<span class="cell" class:type-number={parsed.kind === "primitive" && parsed.base === "number"}
      class:type-bool={parsed.kind === "primitive" && parsed.base === "boolean"}
      class:type-badge={parsed.kind === "enum"}
      class:type-fk={parsed.kind === "fk"}
      class:type-map={parsed.kind === "map"}
      class:type-array={parsed.kind === "array"}>
    {format(value, parsed)}
</span>

<style>
    .cell {
        color: var(--text-primary);
    }
    .type-number {
        display: inline-block;
        width: 100%;
        text-align: right;
        font-variant-numeric: tabular-nums;
    }
    .type-bool {
        color: var(--success);
    }
    .type-badge {
        display: inline-block;
        padding: 1px 6px;
        border-radius: 3px;
        background: var(--bg-primary);
        color: var(--accent);
        font-size: 11px;
    }
    .type-fk {
        color: var(--accent);
    }
    .type-map, .type-array {
        color: var(--text-muted);
        font-size: 11px;
    }
</style>
