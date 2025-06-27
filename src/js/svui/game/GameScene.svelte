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
    import SceneManager from "../../SceneManager";
    import UnitComponent from "../../components/UnitComponent";

    const hero = SceneManager.activeScene.find("game/hero").getComponent(UnitComponent);

    let notifyStats = $state(false);
    let notifySkill = $state(false);

    function updateNotifications() {
        notifyStats = hero.stat.getStat("atpts").value > 0;
        notifySkill = hero.stat.getStat("skpts").value > 0;
    }

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

            subscribe(
                "key:click",
                (event) => {
                    if (event.key === "esc") {
                        if (event.used) {
                            return;
                        }
                        exitGame();
                    }
                },
                undefined,
                -1000,
            ),
        );
        hero.stat.on("atpts", updateNotifications);
        hero.stat.on("skpts", updateNotifications);
        updateNotifications();
    });

    onDestroy(() => {
        while (subs.length > 0) {
            const sub = subs.pop();
            sub?.();
        }
        hero.stat.off("atpts", updateNotifications);
        hero.stat.off("skpts", updateNotifications);
    });
</script>

<div>
    <div>
        <div>
            <button class="btn" onclick={openStats} style={`left: ${40 * 0}px; top: ${40 * 9}px;`}> 状态 </button>
            {#if notifyStats}
                <div class="notification-icon" style={`left: ${40 * 0 + 35}px; top: ${40 * 9}px;`}>*</div>
            {/if}
        </div>
        <button class="btn" onclick={openInventory} style={`left: ${40 * 1.5}px; top: ${40 * 9}px;`}> 装备 </button>
        <button class="btn" onclick={openBag} style={`left: ${40 * 3}px; top: ${40 * 9}px;`}> 背包 </button>
        <div>
            <button class="btn" onclick={openSkill} style={`left: ${40 * 4.5}px; top: ${40 * 9}px;`}> 技能 </button>
            {#if notifySkill}
                <div class="notification-icon" style={`left: ${40 * 4.5 + 35}px; top: ${40 * 9}px;`}>*</div>
            {/if}
        </div>
        <button class="btn" onclick={exitGame} style={`left: ${40 * 4.5}px; top: ${40 * 8}px;`}> 退出 </button>
    </div>

    <JoyStick />
</div>

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

    .notification-icon {
        position: absolute;
        width: 32px;
        height: 32px;
        color: #87ceeb;
        font-size: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        pointer-events: none;
    }
</style>
