<script>
    import Const from "../Const";
    import { dispatch, subscribe } from "../EventBus";
    import JoyStick from "./JoyStick.svelte";
    import InventoryModal from "./InventoryModal.svelte";
    import BagModal from "./BagModal.svelte";
    import AnyaShop from "./AnyaShop.svelte";

    function exitGame() {
        dispatch("scene:menu", null);
    }

    function openInventory() {
        dispatch("modal:show", {
            component: InventoryModal,
            props: {},
        });
    }

    function openBag() {
        dispatch("modal:show", {
            component: BagModal,
            props: {},
        });
    }

    subscribe("shop:anya", () => {
        dispatch("modal:show", { component: AnyaShop });
    });

    subscribe("exit:anya", () => {
        dispatch("modal:close", AnyaShop);
    });
</script>

<div>
    <button style={`left: ${Const.SIZE2 * 0}px; top: ${Const.SIZE2 * 9}px;`}>
        状态
    </button>
    <button
        onclick={openInventory}
        style={`left: ${Const.SIZE2 * 1.5}px; top: ${Const.SIZE2 * 9}px;`}
    >
        装备
    </button>
    <button
        onclick={openBag}
        style={`left: ${Const.SIZE2 * 3}px; top: ${Const.SIZE2 * 9}px;`}
    >
        背包
    </button>
    <button style={`left: ${Const.SIZE2 * 4.5}px; top: ${Const.SIZE2 * 9}px;`}>
        技能
    </button>
    <button
        onclick={exitGame}
        style={`left: ${Const.SIZE2 * 4.5}px; top: ${Const.SIZE2 * 8}px;`}
    >
        退出
    </button>
</div>

<JoyStick />

<style>
    button {
        position: absolute;
        width: 60px;
        height: 40px;
        background: none;
        font-size: 16px;
    }
</style>
