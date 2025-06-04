<script>
    import { onDestroy } from "svelte";
    import { ItemById } from "../config/Item";
    import Const from "../Const";
    import userData from "../data/UserData";
    import { dispatch } from "../EventBus";
    import InspectItemModal from "./InspectItemModal.svelte";
    import MessageBox from "./MessageBox.svelte";
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

    let timerId = -1;

    /**
     *
     * @param {ItemSaveData} item
     */
    function mouseDown(item) {
        if (timerId !== -1) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
            timerId = -1;
            dispatch("modal:show", {
                component: InspectItemModal,
                props: { item },
            });
        }, 500);
    }

    /**
     *
     * @param {ItemSaveData} item
     */
    function mouseExit(item) {
        if (timerId !== -1) {
            clearTimeout(timerId);
            timerId = -1;
            onClickItem(item);
        }
    }

    /**
     *
     * @param {ItemSaveData} item
     */
    function onClickItem(item) {
        dispatch("modal:show", {
            component: MessageBox,
            props: {
                content: `你确定要购买${item.name}吗？`,
                actions: [
                    {
                        text: "确认",
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
                    {
                        text: "取消",
                        autoClose: true,
                    },
                ],
            },
        });
    }

    onDestroy(() => {
        if (timerId !== -1) {
            clearTimeout(timerId);
        }
    });
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
                        style={`width: ${Const.SIZE2}px; height: ${Const.SIZE2}px; left: ${(i % 9) * Const.SIZE2}px; top: ${Math.floor(i / 9) * Const.SIZE2}px; line-height: ${Const.SIZE2}px; background-color: ${Const.QUALITY_COLOR[item.quality]};`}
                        onmousedown={() => mouseDown(item)}
                        onmouseup={() => mouseExit(item)}
                        onmouseleave={() => mouseExit(item)}
                    >
                        <span>{itemConfig.image}</span>
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
        vertical-align: middle;
        text-align: center;
        box-sizing: border-box;
        border: #000 1px solid;
        border-radius: 10%;
    }
</style>
