<script>
    import { onDestroy, onMount } from "svelte";
    import UnitComponent from "../components/UnitComponent";
    import { ItemById } from "../config/Item";
    import Const from "../Const";
    import { dispatch, subscribe } from "../EventBus";
    import SceneManager from "../SceneManager";
    import InspectItemModal from "./InspectItemModal.svelte";

    const { close } = $props();

    function getBagData() {
        const hero = SceneManager.activeScene
            .find("game/hero")
            .getComponent(UnitComponent);
        return hero.persistantData.bag;
    }

    let bagData = $state(getBagData());

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
                        text: "装备",
                        action: () => {
                            const hero =
                                SceneManager.activeScene.find("game/hero");
                            const heroComponent =
                                hero.getComponent(UnitComponent);
                            heroComponent.tryEquipItemFromBag(item);
                        },
                        autoClose: true,
                    },
                ],
            },
        });
    }

    /**@type {any}*/
    let unsub = null;
    onMount(() => {
        unsub = subscribe("bag:refresh", () => {
            bagData = getBagData();
        });
    });

    onDestroy(() => {
        unsub?.();
        unsub = null;
    });
</script>

<div class="backdrop">
    <div class="title">
        <span>背包</span>
        <button onclick={close} class="close-btn">X</button>
    </div>
    <div class="container">
        {#each bagData as item, i (item.uuid)}
            {@const itemConfig = ItemById[item.id]}
            <button
                class="item"
                style={`width: ${Const.SIZE2}px; height: ${Const.SIZE2}px; left: ${(i % 9) * Const.SIZE2}px; top: ${Math.floor(i / 9) * Const.SIZE2}px; line-height: ${Const.SIZE2}px; background-color: ${Const.QUALITY_COLOR_BG[item.quality]};`}
                onclick={() => onClickItem(item)}
            >
                <span>{itemConfig.image}</span>
            </button>
        {/each}
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
    .close-btn {
        background: none;
    }
    .container {
        position: absolute;
        width: 100%;
        height: calc(100% - 24px);
        top: 24px;
        overflow-y: auto;
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
