<script>
    import { SkillById } from "../../config/Skill";
    import { StatById } from "../../config/Stat";
    import { objKeys, strFormat, strIsEmpty } from "../../Utils";

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

{#if statConfig.description != null}
    <div {style}>
        {#if statConfig.type === "int" || statConfig.type === "number"}
            {fmt(strFormat(statConfig.description, val.value))}
        {:else if statConfig.type === "range"}
            {fmt(strFormat(statConfig.description, val.range[0], val.range[1]))}
        {:else if statConfig.type === "set"}
            {fmt(strFormat(statConfig.description, objKeys(val.set).join(",")))}
        {:else if statConfig.type === "skillList"}
            {#each val.skillList as e, i (i)}
                <div>
                    {fmt(strFormat(statConfig.description, e.chance * 100, e.level, SkillById[e.skill].name))}
                </div>
            {/each}
        {:else}
            {new Error(`Unknown stat type: ${statConfig.type}`)}
        {/if}
    </div>
{/if}
