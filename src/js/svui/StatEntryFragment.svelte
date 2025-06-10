<script>
    import { SkillById } from "../config/Skill";
    import { StatById } from "../config/Stat";
    import { objKeys, strFormat, strIsEmpty } from "../Utils";

    /**
     * @typedef {Object} StatEntryFragmentProps
     * @property {StatId} statId - The ID of the stat to display.
     * @property {StatValueSaveData} val - The value of the stat to display.
     * @property {string} [style]
     * @property {string} [formatter] - Additional styles to apply to the container.
     */

    /**@type {StatEntryFragmentProps}*/
    const { statId, val, style = "", formatter = null } = $props();

    const statConfig = $derived(StatById[statId]);

    /**
     *
     * @param {string} text
     */
    function fmt(text) {
        if (strIsEmpty(formatter)) {
            return text;
        } else {
            return strFormat(formatter, text);
        }
    }
</script>

<div {style}>
    {#if statConfig.type === "int"}
        {#if statConfig.format === "int"}
            {fmt(`${statConfig.name}+${Math.floor(val.value)}`)}
        {:else if statConfig.format === "percent"}
            {fmt(`${statConfig.name}+${val.value.toFixed(0)}%`)}
        {:else if statConfig.format === "none"}{:else}
            {new Error(`Unknown stat format: ${statConfig.format}`)}
        {/if}
    {:else if statConfig.type === "number"}
        {#if statConfig.format === "int"}
            {fmt(`${statConfig.name}+${Math.floor(val.value)}`)}
        {:else if statConfig.format === "percent"}
            {fmt(`${statConfig.name}+${val.value.toFixed(2)}%`)}
        {:else if statConfig.format === "none"}{:else}
            {new Error(`Unknown stat format: ${statConfig.format}`)}
        {/if}
    {:else if statConfig.type === "range"}
        {#if statConfig.format === "int"}
            {fmt(`${statConfig.name}+${val.range.map((v) => Math.floor(v)).join("-")}`)}
        {:else if statConfig.format === "percent"}
            {fmt(`${statConfig.name}+${val.range.map((v) => `${v.toFixed(2)}%`).join("-")}`)}
        {:else}
            {new Error(`Unknown stat format: ${statConfig.format}`)}
        {/if}
    {:else if statConfig.type === "set"}
        {fmt(`${statConfig.name} ${objKeys(val.set).join(",")}`)}
    {:else if statConfig.type === "skillList"}
        {fmt(
            val.skillList
                .map((e) =>
                    strFormat(
                        statConfig.description,
                        (e.chance * 100).toFixed(2),
                        Math.floor(e.level),
                        SkillById[e.skill].name,
                    ),
                )
                .join(";"),
        )}
    {:else}
        {new Error(`Unknown stat type: ${statConfig.type}`)}
    {/if}
</div>
