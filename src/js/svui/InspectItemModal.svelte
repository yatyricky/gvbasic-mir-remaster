<script>
    import { ItemById } from "../config/Item";
    import { SkillById } from "../config/Skill";
    import { StatById } from "../config/Stat";
    import Const from "../Const";
    import ItemInstance from "../data/ItemInstance";
    import { strFormat } from "../Utils";

    /**
     * @type {{close: any, item: ItemSaveData, actions: any}}
     */
    const { close, item, actions } = $props();

    const itemConfig = $derived(ItemById[item.id]);
</script>

<div class="backdrop">
    <div class="container" style="display: block;">
        <div class="title">
            <span>查看物品</span>
            <button onclick={close} class="close-btn">X</button>
        </div>
        <div class="content">
            <div
                class="item-name"
                style={`color: ${Const.QUALITY_COLOR_FG[item.quality]}`}
            >
                {item.name}
            </div>
            <div>{Const.SLOT_NAME[itemConfig.slot]}</div>
            <div class="ilvl">物品等级:{item.ilvl}</div>
            {#each Object.entries(item.stats) as [k, v], i (i)}
                {@const statConfig = StatById[/**@type {StatId}*/ (k)]}
                {#if statConfig.format === "int"}
                    {#if statConfig.type === "skillList"}
                        <div>
                            {/**@type {any}*/ (v)
                                .map((/**@type {any}*/ e) =>
                                    strFormat(
                                        statConfig.description,
                                        (e.chance * 100).toFixed(2),
                                        Math.floor(e.level),
                                        SkillById[
                                            /**@type {SkillId}*/ (e.skill)
                                        ].name,
                                    ),
                                )
                                .join(";")}
                        </div>
                    {:else if Array.isArray(v)}
                        <div>
                            {`${statConfig.name}+${v.map((v) => Math.floor(v)).join("-")}`}
                        </div>
                    {:else}
                        <div>{`${statConfig.name}+${Math.floor(v)}`}</div>
                    {/if}
                {:else if statConfig.format === "percent"}
                    {#if Array.isArray(v)}
                        <div>
                            {`${statConfig.name}+${v.map((v) => `${v.toFixed(2)}%`).join("-")}`}
                        </div>
                    {:else}
                        <div>{`${statConfig.name}+${v.toFixed(2)}%`}</div>
                    {/if}
                {/if}
            {/each}
            {#if ItemInstance.getSocketCount(item) > 0}
                <div>有插槽({ItemInstance.getSocketCount(item)})</div>
            {/if}
        </div>
        <div class="actions" style={`height: ${Const.SIZE2}px;`}>
            {#each actions as { text, action, autoClose }, i (i)}
                <button
                    class="action-btn"
                    style={`height: ${Const.SIZE2}px;`}
                    onclick={() => {
                        action?.();
                        if (autoClose) {
                            close();
                        }
                    }}>{text}</button
                >
            {/each}
        </div>
    </div>
</div>

<style>
    .backdrop {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.5);
    }
    .container {
        position: absolute;
        width: 94%;
        height: 94%;
        left: 3%;
        top: 3%;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        background-color: silver;
    }
    .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 1%;
        border-bottom: 1px solid #000;
    }
    .close-btn {
        background: none;
        width: 24px;
        height: 24px;
    }
    .actions {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
        gap: 16px;
    }
    .action-btn {
        background: none;
    }
</style>
