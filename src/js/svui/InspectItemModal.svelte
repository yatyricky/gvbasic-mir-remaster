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
    <div class="container">
        <button onclick={close} class="close-btn">X</button>
        <div class="content">
            <div
                class="item-name"
                style={`color: ${Const.QUALITY_COLOR_FG[item.quality]}`}
            >
                {item.name}
            </div>
            <div class="ilvl">物品等级 {item.ilvl}</div>
            <div class="item-info">
                <div class="item-slot">{Const.SLOT_NAME[itemConfig.slot]}</div>
                <div class="item-type">{Const.TYPE_NAME[itemConfig.type]}</div>
            </div>
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
        display: block;
        position: absolute;
        width: 94%;
        height: 94%;
        left: 3%;
        top: 3%;
        padding: 6px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        background-color: rgba(0, 0, 0, 0.7);
        box-sizing: border-box;
        border-radius: 6px;
        border: 2px solid #383231;
        word-break: break-all;
    }
    .close-btn {
        position: absolute;
        background-color: #680000;
        width: 24px;
        height: 24px;
        box-sizing: border-box;
        border-radius: 2px;
        border: 2px solid #480000;
        padding: 0;
        color: #ceae0f;
        top: 6px;
        right: 6px;
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
    .item-name {
        width: calc(100% - 32px);
    }
    .ilvl {
        color: #e6bd00;
    }
    .item-slot {
        color: #ffffff;
    }
    .item-type {
        color: #ffffff;
    }
    .item-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }   
</style>
