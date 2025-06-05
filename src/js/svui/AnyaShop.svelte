<script>
    import { onDestroy } from "svelte";
    import { ItemById } from "../config/Item";
    import Const from "../Const";
    import userData from "../data/UserData";
    import { dispatch } from "../EventBus";
    import InspectItemModal from "./InspectItemModal.svelte";
    import SceneManager from "../SceneManager";
    import UnitComponent from "../components/UnitComponent";
    import { arrRemove } from "../Utils";

    // import UnitComponent from "../components/UnitComponent";
    // import { ItemById } from "../config/Item";
    // import SceneManager from "../SceneManager";

    const { close } = $props();

    let page = $state(0);

    let goods = $state(userData.getAnyaShopGoods());
    let goodsHeight = $derived(
        (() => {
            return Math.ceil(goods.length / 10) * Const.SIZE2;
        })(),
    );

    /**
     *
     * @param {ItemSaveData} item
     */
    function onClickItem(item) {
        dispatch("modal:show", {
            component: InspectItemModal,
            props: {
                item,
                actions: [
                    {
                        text: "购买",
                        action: () => {
                            const hero =
                                SceneManager.activeScene.find("game/hero");
                            const heroComponent =
                                hero.getComponent(UnitComponent);
                            // if (heroComponent.stat.getStat("gold") < itemConfig.price) {
                            //     dispatch("panel:show", () => {
                            //         const errorPanel = new GameObject("MessageBox");
                            //         errorPanel.addComponent(MessageBox).setTitle("错误").setContent("金币不足，无法购买。");
                            //     });
                            //     return;
                            // }
                            // heroComponent.stat.addStat("gold", -itemConfig.price);
                            heroComponent.addBagItem(item);
                            arrRemove(goods, item);
                            dispatch(
                                "toast",
                                `购买成功，获得物品: ${item.name}`,
                            );
                        },
                        autoClose: true,
                    },
                ],
            },
        });
    }

    onDestroy(() => {});
</script>

<div class="backdrop">
    <div class="title">
        <span>安雅商店</span>
        <button onclick={close} class="close-btn">X</button>
    </div>
    <div class="container">
        {#if page === 0}
            <button
                style={`top: 80px; left: ${Const.SIZE2 * 4.25}px; width: ${Const.SIZE2 * 1.5}px; height: ${Const.SIZE2}px;`}
                onclick={() => (page = 1)}>购买</button
            >
            <button
                style={`top: 130px; left: ${Const.SIZE2 * 4.25}px; width: ${Const.SIZE2 * 1.5}px; height: ${Const.SIZE2}px;`}
                onclick={() => (page = 2)}>出售</button
            >
        {:else if page === 1}
            <div class="goods" style={`height: ${goodsHeight}px;`}>
                {#each goods as item, i (item.uuid)}
                    {@const itemConfig = ItemById[item.id]}
                    <button
                        class="item"
                        style={`width: ${Const.SIZE2}px; height: ${Const.SIZE2}px; left: ${(i % 9) * (Const.SIZE2 + 2)}px; top: ${Math.floor(i / 9) * (Const.SIZE2 + 2)}px; line-height: ${Const.SIZE2}px; border: 2px solid ${Const.QUALITY_COLOR_FG[item.quality]};`}
                        onclick={() => onClickItem(item)}
                    >
                        {#if itemConfig.image.length === 1}
                            <span>{itemConfig.image}</span>
                        {:else}
                            <div
                                style={`background-image: url('${new URL(`../../assets/images/${itemConfig.image}.jpg`, import.meta.url).href}'); background-size: contain; background-repeat: no-repeat; background-position: center; width: 100%; height: 100%;`}
                            ></div>
                        {/if}
                    </button>
                {/each}
            </div>
        {:else if page === 2}{/if}
    </div>
</div>

<style>
    .backdrop {
        position: absolute;
        width: 100%;
        height: 80%;
        left: 0%;
        top: 0%;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        background-color: silver;
    }
    .title {
        position: absolute;
        width: 98%;
        height: 24px;
        top: 0;
        left: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 1%;
        border-bottom: 1px solid #000;
    }
    button {
        position: absolute;
        background: none;
    }
    .close-btn {
        right: 6px;
    }
    .container {
        position: absolute;
        width: 100%;
        height: calc(100% - 24px);
        top: 24px;
        overflow-y: auto;
    }
    .goods {
        width: 100%;
    }
    .item {
        position: absolute;
        padding: 0;
        vertical-align: middle;
        text-align: center;
        box-sizing: border-box;
        border: #000 1px solid;
        border-radius: 10%;
    }
</style>
