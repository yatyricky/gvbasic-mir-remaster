<script>
    import { onDestroy, onMount } from "svelte";
    import UnitComponent from "../components/UnitComponent";
    import { ItemById } from "../config/Item";
    import Const from "../Const";
    import { subscribe } from "../EventBus";
    import SceneManager from "../SceneManager";
    import ItemFragment from "./ItemFragment.svelte";

    const { close } = $props();

    function getInventoryData() {
        const hero = SceneManager.activeScene.find("game/hero").getComponent(UnitComponent);

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
                for (let k = 1; k < Const.ITEM_TYPE_SIZE[itemConfig.type]; k++) {
                    if (j + k < arrangement.length) {
                        arrangement[j + k] = {
                            status: "occupied",
                            item: equip,
                        };
                    } else {
                        console.warn("Item size exceeds slot capacity:", itemConfig, "at index", j + k);
                    }
                }
                j += Const.ITEM_TYPE_SIZE[itemConfig.type];
            }

            ret.push({ slot, arrangement });
        }

        return ret;
    }

    let inventoryData = $state(getInventoryData());

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

    /**@type {Record<SlotType, any>}*/
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
        socket: undefined,
        inherit: undefined,
    };
</script>

<div class="backdrop">
    <div class="wrapper">
        <div class="title">
            <div class="title-text">装备</div>
            <button onclick={close} class="btn close-btn">X</button>
        </div>
        <div class="container">
            <div style="top: 40px; position:absolute; padding: 0;">
                {#each inventoryData as { slot, arrangement } (slot)}
                    {#each arrangement as { status, item }, j (j)}
                        {@const pos = positioning[slot] || {}}
                        <ItemFragment
                            {item}
                            left={pos.left + pos.leftGrow * j}
                            top={pos.top + pos.topGrow * j}
                            width={Const.SIZE2}
                            height={Const.SIZE2}
                            clickable={status === "equipped"}
                            operations={["unequip", "socket"]}
                        />
                    {/each}
                {/each}
            </div>
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
    .btn {
        background-color: #680000;
        border-radius: 4px;
        padding: 0px;
        color: #ceae0f;
    }
    .wrapper {
        position: absolute;
        display: flex;
        flex-direction: column;
        background-color: #403a36;
        border-radius: 4px;
        color: #ffffff;
        border: 1px solid #0e0e0b;
        box-shadow:
            0 0 1px 2px #726e6c,
            inset 0 0 8px 4px #23201f;
        width: 100%;
        height: 94%;
        left: 0%;
        top: 3%;
    }
    .title {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 16px;
        border-radius: 4px;
        border-bottom: 1px solid #6d7070;
        box-shadow: inset 0 0 4px 2px #23201f;
        width: 100%;
        height: 24px;
        padding: 0;
    }
    .title-text {
        flex: 1;
        text-align: center;
        color: #ceae0f;
    }

    .close-btn {
        position: absolute;
        top: 0;
        right: 0;
        width: 24px;
        height: 24px;
    }
    .container {
        flex: 1;
        /* padding: 4px; */
        border-radius: 4px;
        word-break: break-all;
        overflow: auto;
        position: relative;
    }
    .container::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
    }
</style>
