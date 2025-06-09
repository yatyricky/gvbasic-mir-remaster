<script>
    import { SkillById } from "../config/Skill";
    import { StatById } from "../config/Stat";
    import { objKeys, strFormat } from "../Utils";

    /**
     * @typedef {Object} StatEntryFragmentProps
     * @property {StatId} statId - The ID of the stat to display.
     * @property {StatValueSaveData} val - The value of the stat to display.
     * @property {string} [style]
     */

    /**@type {StatEntryFragmentProps}*/
    const { statId, val, style = "" } = $props();

    const statConfig = $derived(StatById[statId]);
</script>

<div {style}>
    {#if statConfig.type === "int"}
        {#if statConfig.format === "int"}
            <div>{`${statConfig.name}+${Math.floor(val.value)}`}</div>
        {:else if statConfig.format === "percent"}
            <div>{`${statConfig.name}+${val.value.toFixed(0)}%`}</div>
        {:else if statConfig.format === "none"}{:else}
            {new Error(`Unknown stat format: ${statConfig.format}`)}
        {/if}
    {:else if statConfig.type === "number"}
        {#if statConfig.format === "int"}
            <div>{`${statConfig.name}+${Math.floor(val.value)}`}</div>
        {:else if statConfig.format === "percent"}
            <div>{`${statConfig.name}+${val.value.toFixed(2)}%`}</div>
        {:else if statConfig.format === "none"}{:else}
            {new Error(`Unknown stat format: ${statConfig.format}`)}
        {/if}
    {:else if statConfig.type === "range"}
        {#if statConfig.format === "int"}
            {`${statConfig.name}+${val.range.map((v) => Math.floor(v)).join("-")}`}
        {:else if statConfig.format === "percent"}
            {`${statConfig.name}+${val.range.map((v) => `${v.toFixed(2)}%`).join("-")}`}
        {:else}
            {new Error(`Unknown stat format: ${statConfig.format}`)}
        {/if}
    {:else if statConfig.type === "set"}
        {`${statConfig.name} ${objKeys(val.set).join(",")}`}
    {:else if statConfig.type === "skillList"}
        {val.skillList
            .map((e) =>
                strFormat(
                    statConfig.description,
                    (e.chance * 100).toFixed(2),
                    Math.floor(e.level),
                    SkillById[e.skill].name,
                ),
            )
            .join(";")}
    {:else}
        {new Error(`Unknown stat type: ${statConfig.type}`)}
    {/if}
</div>
