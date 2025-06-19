<script>
    import { dispatch, subscribe } from "../../EventBus";
    import JoyStick from "./JoyStick.svelte";
    import InventoryModal from "./InventoryModal.svelte";
    import BagModal from "./BagModal.svelte";
    import StatModal from "./StatModal.svelte";
    import AnyaShop from "./AnyaShop.svelte";
    import SkillModal from "./SkillModal.svelte";
    import MessageBox from "../MessageBox.svelte";
    import { onDestroy, onMount } from "svelte";

    function exitGame() {
        dispatch("modal:show", {
            component: MessageBox,
            props: {
                title: "退出游戏",
                content: "确定要退出游戏吗？",
                actions: [
                    {
                        text: "取消",
                        autoClose: true,
                    },
                    {
                        text: "确定",
                        action: () => {
                            dispatch("scene:menu", null);
                        },
                        autoClose: true,
                    },
                ],
            },
        });
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

    function openStats() {
        dispatch("modal:show", {
            component: StatModal,
            props: {},
        });
    }

    function openSkill() {
        dispatch("modal:show", {
            component: SkillModal,
            props: {},
        });
    }

    /**@type {any[]}*/
    const subs = [];

    onMount(() => {
        subs.push(
            subscribe("shop:anya", () => {
                dispatch("modal:show", { component: AnyaShop });
            }),

            subscribe("exit:anya", () => {
                dispatch("modal:close", AnyaShop);
            }),

            subscribe("key:click", (event) => {
                if (event.key === "esc") {
                    if (event.used) {
                        return;
                    }
                    exitGame();
                }
            }, undefined, -1000)
        );
    });

    onDestroy(() => {
        while (subs.length > 0) {
            const sub = subs.pop();
            sub?.();
        }
    });
</script>

<div>
    <button class="btn" onclick={openStats} style={`left: ${40 * 0}px; top: ${40 * 9}px;`}>
        状态
    </button>
    <button class="btn" onclick={openInventory} style={`left: ${40 * 1.5}px; top: ${40 * 9}px;`}>
        装备
    </button>
    <button class="btn" onclick={openBag} style={`left: ${40 * 3}px; top: ${40 * 9}px;`}>
        背包
    </button>
    <button class="btn" onclick={openSkill} style={`left: ${40 * 4.5}px; top: ${40 * 9}px;`}> 技能 </button>
    <button class="btn" onclick={exitGame} style={`left: ${40 * 4.5}px; top: ${40 * 8}px;`}>
        退出
    </button>
</div>

<JoyStick />

<style>
    .btn {
        position: absolute;
        width: 60px;
        height: 40px;
        font-size: 14px;
        background-color: #680000;
        border-radius: 4px;
        padding: 0px;
        color: #ceae0f;
    }
</style>
