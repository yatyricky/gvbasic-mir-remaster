<script>
    import { ItemById } from "../config/Item";
    import Const from "../Const";
    import ItemInstance from "../data/ItemInstance";
    import { arrIsEmpty, objEntries, objIsEmpty } from "../Utils";
    import StatEntryFragment from "./StatEntryFragment.svelte";
    import { UnitById } from "../config/Unit";
    import SceneManager from "../SceneManager";
    import UnitComponent from "../components/UnitComponent";
    import { onDestroy, onMount } from "svelte";
    import { subscribe } from "../EventBus";
    import {
        ItemGroupBySetStat,
        ItemSetGroupBySetStat,
    } from "../config/ItemEx";
    import { AffixById } from "../config/Affix";

    /**
     * @type {{close: any, item: ItemSaveData, actions: any}}
     */
    let { close, item, actions } = $props();
    let it = $state(item); // Svelte 5 state

    const itemConfig = $derived(ItemById[it.id]);
    const hero = SceneManager.activeScene
        .find("game/hero")
        .getComponent(UnitComponent);
    const heroData = hero.persistantData;

    const setEntries = $derived(
        (() => {
            const setItemId = itemConfig.setStat;
            if (setItemId == null) {
                return [];
            }
            /**@type {Array<Partial<{ text: string, color: string, indent: number, height: number; statId: StatId, val: StatValueSaveData, style: string, formatter: string }>>}*/
            const ret = [{ height: 8 }];
            const wholeSet = ItemGroupBySetStat[setItemId];
            const setConfig = ItemSetGroupBySetStat[setItemId];
            /**@type {Set<ItemId>}*/
            const wornItems = new Set();
            for (const [, v] of objEntries(heroData.inventory)) {
                for (const vv of v) {
                    if (ItemById[vv.id].setStat === setItemId) {
                        wornItems.add(vv.id);
                    }
                }
            }
            ret.push({
                text: `${setConfig[0].name}(${wornItems.size}/${wholeSet.length})`,
                color: "#e6bd00",
            });
            for (const setPiece of wholeSet) {
                ret.push({
                    text: setPiece.name,
                    indent: 8,
                    color: wornItems.has(setPiece.id) ? "#FFFFA8" : "#807F86",
                });
            }
            ret.push({ height: 8 });
            for (const completion of setConfig) {
                /**@type {StatData}*/
                const tempStats = {};
                for (const [affixId, qlvl] of objEntries(
                    completion.fixedAffix,
                )) {
                    ItemInstance.collapseAffix(
                        AffixById[affixId],
                        tempStats,
                        0,
                        qlvl,
                    );
                }
                for (const [statId, val] of objEntries(tempStats)) {
                    ret.push({
                        statId,
                        val,
                        style: `color: ${wornItems.size >= completion.setCount ? Const.QUALITY_COLOR_FG[1] : "#807F86"};`,
                        formatter: `(${completion.setCount})套装: {0}`,
                    });
                }
            }
            return ret;
        })(),
    );

    /**@type {any}*/
    let unsub = null;
    onMount(() => {
        unsub = subscribe("item:refresh", (uuid) => {
            if (it.uuid === uuid) {
                it = hero.findItemByUuid(uuid);
            }
        });
    });

    onDestroy(() => {
        unsub?.();
        unsub = null;
    });
</script>

<div class="backdrop">
    <div class="container">
        <div class="content">
            {#if it.runeWord != null}
                {@const runeWord = ItemById[it.runeWord]}
                <div
                    class="item-name"
                    style="color: {Const.QUALITY_COLOR_FG[runeWord.quality]}"
                >
                    {runeWord.name}
                </div>
            {/if}
            <div
                class="item-name"
                style={`color: ${Const.QUALITY_COLOR_FG[it.quality]}`}
            >
                {it.name}
            </div>
            {#if !objIsEmpty(it.sockets)}
                <div
                    class="item-name"
                    style="color: {Const.QUALITY_COLOR_FG[
                        it.runeWord != null ? ItemById[it.runeWord].quality : 0
                    ]}"
                >
                    "{objEntries(it.sockets)
                        .map(([, s]) => ItemById[s.id].name)
                        .join("")}"
                </div>
            {/if}
            <div class="ilvl">物品等级 {it.ilvl}</div>
            <div class="item-info">
                <div class="item-slot">
                    {Const.SLOT_NAME[Const.ITEM_TYPE_SLOT[itemConfig.type]]}
                </div>
                <div class="item-type">{Const.TYPE_NAME[itemConfig.type]}</div>
            </div>
            {#each objEntries(it.baseStats) as [k, v], i (i)}
                <StatEntryFragment
                    style={`color: ${Const.QUALITY_COLOR_FG[0]}`}
                    statId={k}
                    val={v}
                />
            {/each}
            {#each objEntries(it.extStats) as [k, v], i (i)}
                <StatEntryFragment
                    style={`color: ${Const.QUALITY_COLOR_FG[1]}`}
                    statId={k}
                    val={v}
                />
            {/each}
            {#if !arrIsEmpty(itemConfig.classOnly)}
                <div
                    style="color: {itemConfig.classOnly.includes(
                        heroData.unitId,
                    )
                        ? Const.QUALITY_COLOR_FG[0]
                        : '#DB333C'}"
                >
                    限定职业: {itemConfig.classOnly
                        .map((e) => UnitById[e].name)
                        .join(", ")}
                </div>
            {/if}
            {#if ItemInstance.getSocketCount(it) > 0}
                <div>
                    插槽({ItemInstance.getFilledSocketCount(
                        it,
                    )}/{ItemInstance.getSocketCount(it)})
                </div>
            {/if}
            {#each objEntries(it.sockets) as [, v], i (i)}
                {#each objEntries(v.baseStats) as [kk, vv], j (j)}
                    <StatEntryFragment
                        style={`color: ${Const.QUALITY_COLOR_FG[1]}`}
                        statId={kk}
                        val={vv}
                    />
                {/each}
                {#each objEntries(v.extStats) as [kk, vv], j (j)}
                    <StatEntryFragment
                        style={`color: ${Const.QUALITY_COLOR_FG[1]}`}
                        statId={kk}
                        val={vv}
                    />
                {/each}
            {/each}
            {#if it.runeWord != null}
                <div>符文之语</div>
                {#each objEntries(it.runeWordStats) as [k, v], i (i)}
                    <StatEntryFragment
                        style={`color: ${Const.QUALITY_COLOR_FG[1]}`}
                        statId={k}
                        val={v}
                    />
                {/each}
            {/if}

            {#each setEntries as setEntry, i (i)}
                {#if setEntry.statId != null}
                    <StatEntryFragment
                        style={setEntry.style}
                        statId={setEntry.statId}
                        val={setEntry.val}
                        formatter={setEntry.formatter}
                    />
                {:else}
                    <div
                        style={`
                            ${setEntry.color != null ? `color:${setEntry.color};` : ""} 
                            ${setEntry.indent != null ? `padding-left: ${setEntry.indent}px;` : ""} 
                            ${setEntry.height != null ? `height: ${setEntry.height}px;` : ""} 
                        `}
                    >
                        {setEntry.text}
                    </div>
                {/if}
            {/each}

            <div>需要等级 {it.level}</div>
        </div>
        <button
            onclick={close}
            class="btn"
            style="
            right: 6px;
            top: 6px;
            width: 24px;
            height: 24px;
        ">X</button
        >
        <div class="actions" style={`height: ${Const.SIZE2}px;`}>
            {#each actions as { text, action, autoClose }, i (i)}
                <button
                    class="btn"
                    style="
                        left: {(Const.SIZE2 * 10 * 0.94 -
                        Const.SIZE2 * 1.8 * actions.length -
                        12 * (actions.length - 1)) /
                        2 +
                        i * (Const.SIZE2 * 1.8 + 12)}px;
                        width: {Const.SIZE2 * 1.8}px;
                        height: {Const.SIZE2 * 0.8}px;
                    "
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
        background-color: rgba(0, 0, 0, 0.8);
        box-sizing: border-box;
        border-radius: 6px;
        border: 2px solid #383231;
        word-break: break-all;
        color: #ffffff;
    }
    .content {
        position: absolute;
        padding: 4px;
        width: calc(100% - 8px);
        height: calc(100% - 24px - 32px);
        top: 24;
        left: 0;
        overflow: auto;
    }
    .content::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
    }
    .btn {
        position: absolute;
        background-color: #680000;
        box-sizing: border-box;
        border-radius: 4px;
        padding: 0;
        color: #ceae0f;
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
    .item-name {
        width: 100%;
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
