<script>
    import UnitComponent from "../components/UnitComponent";
    import { ItemById } from "../config/Item";
    import Const from "../Const";
    import { dispatch } from "../EventBus";
    import SceneManager from "../SceneManager";
    import InspectItemModal from "./InspectItemModal.svelte";
    import ItemInstance from "../data/ItemInstance";
    import SocketItemModal from "./SocketItemModal.svelte";

    /**
     * @typedef {Object} ItemFragmentProps
     * @property {ItemSaveData} item - The item data to display.
     * @property {number} left - The left position of the item in pixels.
     * @property {number} top - The top position of the item in pixels.
     * @property {number} [width=Const.SIZE2] - The width of the item in pixels, default is Const.SIZE2.
     * @property {number} [height=Const.SIZE2] - The height of the item in pixels, default is Const.SIZE2.
     * @property {Array<"equip" | "unequip" | "socket" | "buy">} [operations=[]] - The actions available for the item.
     * @property {Partial<Record<"equip" | "unequip" | "socket" | "buy", () => void>>} [callbacks={}] - Callbacks for item operations.
     * @property {boolean} [clickable=true]
     */

    /**
     * @type {ItemFragmentProps}
     */
    const {
        item,
        left,
        top,
        width = Const.SIZE2,
        height = Const.SIZE2,
        operations = [],
        callbacks = {},
        clickable = true,
    } = $props();

    const itemConfig = $derived(ItemById[item?.id]);
    const borderStyle = $derived(
        (() => {
            if (item == null) {
                return "solid";
            }
            return ItemInstance.getSocketCount(item) > 0 ? "dashed" : "solid";
        })(),
    );
    const borderColor = $derived(
        Const.QUALITY_COLOR_FG[item == null ? 0 : item.quality],
    );

    function onclick() {
        if (item == null || !clickable) {
            return;
        }
        const actions = [];
        const itemConfig = ItemById[item.id];
        if (
            operations.includes("equip") &&
            Const.EQUIPABLE_TYPES.includes(itemConfig.type)
        ) {
            actions.push({
                text: "装备",
                action: () => {
                    const hero = SceneManager.activeScene.find("game/hero");
                    const heroComponent = hero.getComponent(UnitComponent);
                    heroComponent.tryEquipItemFromBag(item);
                    callbacks.equip?.();
                },
                autoClose: true,
            });
        }
        if (operations.includes("unequip")) {
            actions.push({
                text: "卸下",
                action: () => {
                    const hero = SceneManager.activeScene.find("game/hero");
                    const heroComponent = hero.getComponent(UnitComponent);
                    heroComponent.tryUnquip(item);
                    callbacks.unequip?.();
                },
                autoClose: true,
            });
        }
        if (
            operations.includes("socket") &&
            ItemInstance.getSocketCount(item) > 0
        ) {
            actions.push({
                text: "镶嵌",
                action: () => {
                    const hero = SceneManager.activeScene
                        .find("game/hero")
                        .getComponent(UnitComponent);
                    dispatch("modal:show", {
                        component: SocketItemModal,
                        props: { item, fillers: hero.getSocketFillers() },
                    });
                    callbacks.socket?.();
                },
            });
        }
        if (operations.includes("buy")) {
            actions.push({
                text: "购买",
                action: () => {
                    const hero = SceneManager.activeScene.find("game/hero");
                    const heroComponent = hero.getComponent(UnitComponent);
                    heroComponent.addBagItem(item);
                    dispatch("toast", `购买成功，获得物品: ${item.name}`);
                    callbacks.buy?.();
                },
                autoClose: true,
            });
        }
        dispatch("modal:show", {
            component: InspectItemModal,
            props: { item, actions },
        });
    }
</script>

<button
    class="item"
    style={`
        width: ${width}px;
        height: ${height}px;
        left: ${left}px;
        top: ${top}px;
        line-height: ${height}px;
        border: 2px ${borderStyle} ${borderColor};
    `}
    {onclick}
>
    {#if item != null}
        {#if itemConfig.image.length === 1}
            <span>{itemConfig.image}</span>
        {:else}
            <div
                class="icon"
                style={`background-image: url('${new URL(`../../assets/images/${itemConfig.image}.jpg`, import.meta.url).href}');`}
            >
                {#if !clickable}
                    <div class="mask"></div>
                {/if}
            </div>
        {/if}
    {/if}
</button>

<style>
    .item {
        position: absolute;
        vertical-align: middle;
        text-align: center;
        box-sizing: border-box;
        border-radius: 10%;
        padding: 0;
    }
    .icon {
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        width: 100%;
        height: 100%;
    }
    .mask {
        width: 100%;
        height: 100%;
        background-color: black;
    }
</style>
