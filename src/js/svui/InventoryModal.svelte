<script>
    import { onDestroy, onMount } from "svelte";
    import UnitComponent from "../components/UnitComponent";
    import { ItemById } from "../config/Item";
    import Const from "../Const";
    import { dispatch, subscribe } from "../EventBus";
    import SceneManager from "../SceneManager";
    import InspectItemModal from "./InspectItemModal.svelte";

    const { close } = $props();

    function getInventoryData() {
        const hero = SceneManager.activeScene
            .find("game/hero")
            .getComponent(UnitComponent);

        const ret = [];
        for (const slot of Const.SLOT_SORT) {
            let equipped = hero.persistantData.inventory[slot];
            if (equipped == null) {
                equipped = [];
                hero.persistantData.inventory[slot] = equipped;
            }
            /**@type {Array<{status: "empty"|"equipped"|"occupied", item: ItemSaveData}>} */
            const arrangement = [];
            for (let i = 0; i < Const.SLOT_MAX_SIZE[slot]; i++) {
                arrangement.push({ status: "empty", item: null });
            }

            let j = 0;
            for (const equip of equipped) {
                const itemConfig = ItemById[equip.id];
                if (itemConfig == null) {
                    console.warn("Unknown item in inventory:", equip);
                    continue;
                }
                arrangement[j] = { status: "equipped", item: equip };
                for (let k = 1; k < itemConfig.size; k++) {
                    if (j + k < arrangement.length) {
                        arrangement[j + k] = {
                            status: "occupied",
                            item: equip,
                        };
                    } else {
                        console.warn(
                            "Item size exceeds slot capacity:",
                            itemConfig,
                            "at index",
                            j + k,
                        );
                    }
                }
                j += itemConfig.size;
            }

            ret.push({ slot, arrangement });
        }

        return ret;
    }

    let inventoryData = $state(getInventoryData());

    /**
     *
     * @param {ItemSaveData} item
     */
    function onClickItem(item) {
        if (item == null) {
            return;
        }
        dispatch("modal:show", {
            component: InspectItemModal,
            props: {
                item,
                actions: [
                    {
                        text: "卸下",
                        action: () => {
                            const hero =
                                SceneManager.activeScene.find("game/hero");
                            const heroComponent =
                                hero.getComponent(UnitComponent);
                            heroComponent.tryUnquip(item);
                            inventoryData = getInventoryData();
                        },
                        autoClose: true,
                    },
                ],
            },
        });
    }

    /** @type {any}*/
    let unsub = null;
    onMount(() => {
        // Subscribe to inventory updates
        unsub = subscribe("inventory:refresh", () => {
            inventoryData = getInventoryData();
        });
    });

    onDestroy(() => {
        unsub?.();
        unsub = null;
    });

    /**@type {any}*/
    const positioning = {
        head: { left: 0, top: 0, leftGrow: 0, topGrow: 0 },
        neck: { left: 0, top: Const.SIZE2 * 1, leftGrow: 0, topGrow: 0 },
        shoulder: { left: 0, top: Const.SIZE2 * 2, leftGrow: 0, topGrow: 0 },
        torso: { left: 0, top: Const.SIZE2 * 3, leftGrow: 0, topGrow: 0 },
        wrist: { left: 0, top: Const.SIZE2 * 4, leftGrow: 0, topGrow: 0 },
        hand: { left: Const.SIZE2 * 9, top: 0, leftGrow: 0, topGrow: 0 },
        waist: {
            left: Const.SIZE2 * 9,
            top: Const.SIZE2 * 1,
            leftGrow: 0,
            topGrow: 0,
        },
        leg: {
            left: Const.SIZE2 * 9,
            top: Const.SIZE2 * 2,
            leftGrow: 0,
            topGrow: 0,
        },
        foot: {
            left: Const.SIZE2 * 9,
            top: Const.SIZE2 * 3,
            leftGrow: 0,
            topGrow: 0,
        },
        finger: {
            left: Const.SIZE2 * 8,
            top: Const.SIZE2 * 4,
            leftGrow: Const.SIZE2,
            topGrow: 0,
        },
        arms: {
            left: Const.SIZE2 * 4,
            top: Const.SIZE2 * 4,
            leftGrow: Const.SIZE2,
            topGrow: 0,
        },
        accessory: {
            left: Const.SIZE2 * 0,
            top: Const.SIZE2 * 5,
            leftGrow: Const.SIZE2,
            topGrow: 0,
        },
    };
</script>

<div class="backdrop">
    <div class="title">
        <span>装备</span>
        <button onclick={close} class="close-btn">X</button>
    </div>
    <div class="container">
        {#each inventoryData as { slot, arrangement } (slot)}
            {#each arrangement as { status, item }, j (j)}
                {@const pos = positioning[slot] || {}}
                {@const itemConfig = ItemById[item?.id]}

                <button
                    class="item"
                    style="
                        left: {pos.left + pos.leftGrow * j}px;
                        top: {pos.top + pos.topGrow * j}px;
                        width: {Const.SIZE2}px;
                        height: {Const.SIZE2}px;
                        border: 2px solid {Const.QUALITY_COLOR_FG[
                        item?.quality || 0
                    ]};
                    "
                    onclick={() => {
                        if (status !== "equipped") {
                            return;
                        }
                        onClickItem(item);
                    }}
                >
                    {#if status === "occupied"}
                        {#if itemConfig.image.length === 1}
                            <span>{itemConfig.image}</span>
                        {:else}
                            <div
                                style="width: 100%; height: 100%; background-color: black;"
                            >
                                <div
                                    style={` background-image: url('${new URL(`../../assets/images/${itemConfig.image}.jpg`, import.meta.url).href}'); background-size: contain; background-repeat: no-repeat; background-position: center; width: 100%; height: 100%; opacity: 0.3;`}
                                ></div>
                            </div>
                        {/if}
                    {:else if status === "equipped"}
                        {#if itemConfig.image.length === 1}
                            <span>{itemConfig.image}</span>
                        {:else}
                            <div
                                style={`background-image: url('${new URL(`../../assets/images/${itemConfig.image}.jpg`, import.meta.url).href}'); background-size: contain; background-repeat: no-repeat; background-position: center; width: 100%; height: 100%;`}
                            ></div>
                        {/if}
                    {/if}
                </button>
            {/each}
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
        padding: 0;
        vertical-align: middle;
        text-align: center;
        box-sizing: border-box;
        border: #000 1px solid;
        border-radius: 10%;
    }
</style>
