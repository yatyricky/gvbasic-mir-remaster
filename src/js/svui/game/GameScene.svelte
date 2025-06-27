<script>
    import { dispatch, subscribe } from "../../EventBus";
    import JoyStick from "./JoyStick.svelte";
    import InventoryModal from "./InventoryModal.svelte";
    import BagModal from "./BagModal.svelte";
    import StatModal from "./StatModal.svelte";
    import AnyaShop from "./AnyaShop.svelte";
    import SkillModal from "./SkillModal.svelte";
    import SkillPicker from "./SkillPicker.svelte";
    import MessageBox from "../MessageBox.svelte";
    import { onDestroy, onMount } from "svelte";
    import SceneManager from "../../SceneManager";
    import UnitComponent from "../../components/UnitComponent";
    import { SkillById } from "../../config/Skill";

    const hero = SceneManager.activeScene.find("game/hero").getComponent(UnitComponent);

    let notifyStats = $state(false);
    let notifySkill = $state(false);
    let modifyingKeys = $state(false);

    /**@type {SkillId[][]}*/
    let keyMappings = $state([]);

    function updateKeyMappings() {
        /**@type {SkillId[][]}*/
        const map = [];

        for (let bar = 0; bar < 3; bar++) {
            const row = [];
            for (let pos = 0; pos < 8; pos++) {
                row.push(null);
            }
            map.push(row);
        }

        for (const kms of hero.persistantData.keyMap) {
            if (hero.getSkillLevel(kms.skillId).val <= 0) {
                continue;
            }
            if (kms.bar < 0 || kms.bar >= 3 || kms.pos < 0 || kms.pos >= 8) {
                continue; // Invalid key mapping
            }
            if (map[kms.bar][kms.pos] != null) {
                console.warn(`Key mapping conflict at bar ${kms.bar}, pos ${kms.pos}`);
            }
            map[kms.bar][kms.pos] = kms.skillId;
        }

        keyMappings = map;
    }

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

    /**
     * Handle skill selection from SkillPicker
     * @param {number} bar
     * @param {number} pos
     * @param {SkillId} skillId
     */
    function onSkillPicked(bar, pos, skillId) {
        // Remove any existing mapping at this position
        const existingPositionIndex = hero.persistantData.keyMap.findIndex((kms) => kms.bar === bar && kms.pos === pos);
        if (existingPositionIndex !== -1) {
            hero.persistantData.keyMap.splice(existingPositionIndex, 1);
        }

        // Add new mapping
        hero.persistantData.keyMap.push({
            skillId: skillId,
            bar: bar,
            pos: pos,
        });

        // Update the UI
        updateKeyMappings();
    }

    /**
     *
     * @param {number} bar
     * @param {number} pos
     */
    function onClickActionBar(bar, pos) {
        const skillId = keyMappings[bar][pos];
        let config;
        if (skillId != null) {
            config = SkillById[skillId];
        }
        if (hero.isCombat) {
            // use skill
            return;
        }
        if (modifyingKeys) {
            // modify key - show skill picker
            dispatch("modal:show", {
                component: SkillPicker,
                props: {
                    bar: bar,
                    pos: pos,
                    onSkillPicked: onSkillPicked,
                },
            });
            return;
        }
        if (config == null) {
            return;
        }
        dispatch("modal:show", {
            component: MessageBox,
            props: {
                title: config?.name,
                content: hero.getSkillHtml(skillId),
                html: true,
            },
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

            subscribe("inventory:refresh", () => {
                // Update key mappings when inventory changes, as skills can be gained/lost from equipment
                updateKeyMappings();
                updateNotifications();
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
        updateKeyMappings();
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
    <div class="sk-container">
        {#each keyMappings as row, bar (bar)}
            {#each row as skId, pos (pos)}
                {@const skillConfig = skId == null ? null : SkillById[/**@type {SkillId}*/ (skId)]}
                <button
                    aria-label={`技能栏 ${bar + 1} 按钮 ${pos + 1}`}
                    style={`"
                        position: absolute;
                        width: 48px;
                        height: 48px;
                        left: ${50 * pos}px;
                        top: ${50 * bar}px;
                        margin: 1px;
                        background-image: url('${skillConfig?.icon ? new URL(`../../../assets/images/${skillConfig.icon}.jpg`, import.meta.url).href : ""}');
                        background-color: #4d4540;
                        background-size: contain;
                        background-repeat: no-repeat;
                        background-position: center;
                    "`}
                    onclick={() => onClickActionBar(bar, pos)}
                ></button>
            {/each}
        {/each}
    </div>
    {#if modifyingKeys}
        <button
            class="btn"
            onclick={() => {
                modifyingKeys = !modifyingKeys;
            }}
            style={`width: 120px; left: ${40 * 3 + 20}px; top: ${40 * 8 + 20}px;`}
        >
            结束改键
        </button>
    {:else}
        <div>
            <div>
                <div>
                    <button class="btn" onclick={openStats} style={`left: ${40 * 0}px; top: ${40 * 9}px;`}>
                        状态
                    </button>
                    {#if notifyStats}
                        <div class="notification-icon" style={`left: ${40 * 0 + 35}px; top: ${40 * 9}px;`}>*</div>
                    {/if}
                </div>
                <button class="btn" onclick={openInventory} style={`left: ${40 * 1.5}px; top: ${40 * 9}px;`}>
                    装备
                </button>
                <button class="btn" onclick={openBag} style={`left: ${40 * 3}px; top: ${40 * 9}px;`}> 背包 </button>
                <div>
                    <button class="btn" onclick={openSkill} style={`left: ${40 * 4.5}px; top: ${40 * 9}px;`}>
                        技能
                    </button>
                    {#if notifySkill}
                        <div class="notification-icon" style={`left: ${40 * 4.5 + 35}px; top: ${40 * 9}px;`}>*</div>
                    {/if}
                </div>
                <button class="btn" onclick={exitGame} style={`left: ${40 * 4.5}px; top: ${40 * 8}px;`}> 退出 </button>
                <button
                    class="btn"
                    onclick={() => {
                        modifyingKeys = !modifyingKeys;
                    }}
                    style={`left: ${40 * 3}px; top: ${40 * 8}px;`}
                >
                    改键
                </button>
            </div>

            <JoyStick />
        </div>
    {/if}
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
    .sk-container {
        position: absolute;
        width: 400px;
        height: 150px;
        left: 0;
        top: 160px;
        box-shadow: inset 0 0 4px 2px #23201f;
    }
</style>
