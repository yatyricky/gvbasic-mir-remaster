<script>
    import { onDestroy, onMount } from "svelte";
    import UnitComponent from "../../components/UnitComponent";
    import SceneManager from "../../SceneManager";
    import { SkillById, SkillGroupByKlass } from "../../config/Skill";
    import { arrIsEmpty } from "../../Utils";
    import { dispatch, subscribe } from "../../EventBus";
    import MessageBox from "../MessageBox.svelte";
    import Const from "../../Const";
    import { Stats } from "../../config/Stat";

    const { close } = $props();

    /** @type {Partial<Record<UnitId, SkillTag[]>>}*/
    const BranchesByClass = {
        mage: ["fire", "thunder"],
        warr: ["battle", "xskill"],
        wlk: ["holy", "psyco"],
    };

    const SkillIconSize = 32;
    const GapX = Math.floor((270 - SkillIconSize * 3) / 4);
    const GapY = SkillIconSize / 2;

    const hero = SceneManager.activeScene.find("game/hero").getComponent(UnitComponent);
    const data = hero.persistantData;

    function getSkillData() {
        const allSkills = SkillGroupByKlass[data.unitId];
        /**@type {Partial<Record<SkillTag, ISkillConfig[]>>}*/
        const branchSkills = {};
        for (const skill of allSkills) {
            for (const t of skill.tag) {
                if (!branchSkills[t]) {
                    branchSkills[t] = [];
                }
                branchSkills[t].push(skill);
            }
        }

        /**@type {SkillId[]}*/
        const notMySkills = [];
        for (const e of Stats) {
            if (e.targetSkill == null) {
                continue;
            }
            if (e.isSkillMod === true) {
                continue;
            }
            if (!arrIsEmpty(e.unitConstraint)) {
                continue;
            }
            if (SkillGroupByKlass[data.unitId].some((skill) => skill.id === e.targetSkill)) {
                continue;
            }
            if (hero.stat.getStat(e.id).value <= 0) {
                continue;
            }
            notMySkills.push(e.targetSkill);
        }
        if (notMySkills.length > 0) {
            branchSkills["other"] = [];
            for (const skillId of notMySkills) {
                const skill = SkillById[skillId];
                if (skill) {
                    branchSkills["other"].push(skill);
                }
            }
        }

        return branchSkills;
    }

    let skillData = $state(getSkillData());
    const branches = $derived(
        (() => {
            const ret = [...BranchesByClass[data.unitId]];
            if (!arrIsEmpty(skillData.other)) {
                ret.push("other");
            }
            return ret;
        })(),
    );
    const branchToggleState = $state([true, false]);
    let selectedBranch = $state(0);
    const currentBranch = $derived(skillData[branches[selectedBranch]]);
    const skillState = $derived(
        (() => {
            /**@type {Partial<Record<SkillId, {upgrade:boolean}>>}*/
            const skills = {};
            if (!currentBranch) return skills;

            for (const skill of currentBranch) {
                skills[skill.id] = {
                    upgrade:
                        skillData.other?.some((s) => s.id === skill.id) === true ||
                        hero.stat.getStat("level").value >= skill.level &&
                        (arrIsEmpty(skill.prerequisite) ||
                            skill.prerequisite.every((id) => hero.getLearntSkillLevel(id) > 0)),
                };
            }
            return skills;
        })(),
    );
    const skillPositions = $derived(
        (() => {
            /**@type {Partial<Record<SkillId, {x: number, y: number}>>}*/
            const positions = {};
            if (!currentBranch) return positions;

            for (const skill of currentBranch) {
                const x = (skill.posx - 1) * (SkillIconSize + GapX) + GapX + SkillIconSize / 2;
                const y = Math.floor(skill.level / 7) * (SkillIconSize + GapY) + GapY + SkillIconSize / 2;
                positions[skill.id] = { x, y };
            }
            return positions;
        })(),
    );

    const arrows = $derived(
        (() => {
            /**@type {Array<{from: SkillId, to: SkillId, lit: boolean, color: string}>}*/
            const arrows = [];
            if (!currentBranch) return arrows;

            for (const skill of currentBranch) {
                if (!arrIsEmpty(skill.prerequisite)) {
                    for (const prereqId of skill.prerequisite) {
                        if (skillPositions[prereqId] && skillPositions[skill.id]) {
                            arrows.push({
                                from: prereqId,
                                to: skill.id,
                                lit: hero.getLearntSkillLevel(skill.id) > 0,
                                color: getArrowColor(skill.id),
                            });
                        }
                    }
                }
            }
            return arrows;
        })(),
    );

    let remainingSkillPoints = $state(hero.stat.getStat("skpts").value);

    /**
     *
     * @param {SkillId} skillId
     */
    function clickSkill(skillId) {
        const config = SkillById[skillId];
        /**@type {any}*/
        const actions = [];
        if (
            skillData.other?.some((s) => s.id === skillId) !== true &&
            hero.stat.getStat("skpts").value > 0 &&
            skillState[skillId]?.upgrade === true &&
            (config.prerequisite == null || config.prerequisite.every((id) => hero.getLearntSkillLevel(id) > 0)) &&
            hero.getLearntSkillLevel(skillId) < Const.SKILL_MAX_LEVEL
        ) {
            actions.push({
                text: "升级",
                action: () => {
                    hero.upgradeSkill(skillId);
                },
                autoClose: true,
            });
        }
        dispatch("modal:show", {
            component: MessageBox,
            props: {
                title: config.name,
                content: hero.getSkillHtml(skillId, true),
                actions,
                html: true,
            },
        });
    }

    /**@type {any}*/
    let unsub = null;
    onMount(() => {
        unsub = subscribe("skill:refresh", () => {
            skillData = getSkillData();
            remainingSkillPoints = hero.stat.getStat("skpts").value;
        });
    });

    onDestroy(() => {
        unsub?.();
        unsub = null;
    });

    /**
     *
     * @param {SkillId} skillId
     */
    const getArrowColor = (skillId) => {
        const skill = currentBranch.find((s) => s.id === skillId);
        if (skill && skill.tag.length > 0) {
            return Const.SKILL_TAG_COLOR[skill.tag[0]];
        }
        return "#6d7070"; // Default gray
    };
</script>

<div class="backdrop">
    <div class="tabs">
        {#each branches as branch, i}
            <button
                class="btn toggle {branchToggleState[i] ? 'toggle-active' : ''}"
                style={branchToggleState[i] ? `--theme-color: ${Const.SKILL_TAG_COLOR[branch]};` : ""}
                onclick={() => {
                    for (let idx = 0; idx < branches.length; idx++) {
                        branchToggleState[idx] = idx === i;
                    }
                    selectedBranch = i;
                }}
            >
                {Const.SKILL_TAG_NAME[branch]}
            </button>
        {/each}
    </div>
    <div class="wrapper">
        <div class="title">
            <div class="title-text">技能</div>
            <button onclick={close} class="btn close-btn">X</button>
        </div>
        <div class="container">
            <div class="skill-tree">
                {#if branches[selectedBranch] !== "other"}
                    <!-- Add SVG for arrows -->
                    <svg class="arrows">
                        <defs>
                            <!-- Default markers -->
                            <marker
                                id="arrowhead-lit-default"
                                markerWidth="5"
                                markerHeight="3.5"
                                refX="5"
                                refY="1.75"
                                orient="auto"
                            >
                                <polygon points="0 0, 5 1.75, 0 3.5" fill="#ceae0f"></polygon>
                            </marker>
                            <marker
                                id="arrowhead-unlit-default"
                                markerWidth="5"
                                markerHeight="3.5"
                                refX="5"
                                refY="1.75"
                                orient="auto"
                            >
                                <polygon points="0 0, 5 1.75, 0 3.5" fill="#6d7070"></polygon>
                            </marker>
                        </defs>
                        {#each arrows as arrow}
                            <line
                                x1={skillPositions[arrow.from].x}
                                y1={skillPositions[arrow.from].y + SkillIconSize / 2}
                                x2={skillPositions[arrow.to].x}
                                y2={skillPositions[arrow.to].y - SkillIconSize / 2}
                                stroke={arrow.lit ? "#ceae0f" : "#6d7070"}
                                stroke-width="2"
                                marker-end={arrow.lit ? `url(#arrowhead-lit-default)` : `url(#arrowhead-unlit-default)`}
                            ></line>
                        {/each}
                    </svg>
                {/if}

                {#each currentBranch as skill, i (skill.id)}
                    {@const status = skillState[skill.id]}
                    {@const skillLevel = hero.getSkillLevel(skill.id)}
                    {@const left =
                        (branches[selectedBranch] === "other" ? i % 3 : skill.posx - 1) * (SkillIconSize + GapX) + GapX}
                    {@const top =
                        Math.floor(branches[selectedBranch] === "other" ? i / 3 : skill.level / 7) *
                            (SkillIconSize + GapY) +
                        GapY}
                    <button
                        class="skill"
                        onclick={() => clickSkill(skill.id)}
                        aria-label={skill.name}
                        style="
                            width: {SkillIconSize}px;
                            height: {SkillIconSize}px;
                            left: {left}px;
                            top: {top}px;
                            background-image: url('{new URL(`../../../assets/images/${skill.icon}.jpg`, import.meta.url)
                            .href}');
                            border: 1px solid ${skill.tag.length > 0 ? Const.SKILL_TAG_COLOR[skill.tag[0]] : '#6d7070'};
                            box-shadow: 0 0 3px ${skill.tag.length > 0
                            ? Const.SKILL_TAG_COLOR[skill.tag[0]]
                            : '#6d7070'};
                        "
                    >
                        <div class="skill-level" style="color: {skillLevel.ext > 0 ? 'rgb(30,255,0)' : 'white'};">
                            {skillLevel.val}
                        </div>
                        {#if status == null || !status.upgrade}
                            <div class="mask"></div>
                        {:else if status.upgrade}
                            <!-- <div class="upgrade-indicator">+</div> -->
                        {/if}
                    </button>
                {/each}
            </div>
            <div class="skill-points">
                剩余技能点数: {remainingSkillPoints}
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
        width: 270px;
        height: 86%;
        left: 65px;
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
        display: flex;
    }
    .container::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
    }
    .skill-points {
        position: absolute;
        text-align: center;
        width: 100%;
        bottom: 2px;
        color: #ceae0f;
        font-size: 12px;
    }
    .skill-tree {
        width: 100%;
        position: relative;
        /* height: 720px; */
    }
    .tabs {
        position: absolute;
        left: 65px;
        top: 87%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 32px;
        padding: 6px;
        gap: 10px;
    }
    .toggle {
        width: 80px;
        height: 32px;
        border-top: none;
        background-color: #403a36;
        border-radius: 4px;
        border: 1px solid #0e0e0b;
        box-shadow:
            0 0 1px 2px #726e6c,
            inset 0 0 8px 4px #23201f;
        text-shadow: 1px 1px 1px #000000;
        vertical-align: middle;
    }
    .toggle-active {
        border: 1px solid #9c840c;
        box-shadow:
            0 0 1px 2px #9c840c,
            inset 0 8px 8px -8px #9c840c,
            inset 0 -8px 8px -8px #9c840c,
            inset 8px 0 8px -8px #9c840c,
            inset -8px 0 8px -8px #9c840c;
        color: #ffffff;
    }
    .skill {
        position: absolute;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        border: #ceae0f 1px solid;
        border-radius: 4px;
        padding: 0;
        z-index: 0; /* Ensure skills appear above the arrows */
    }
    .arrows {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
        /* Set to 0 to be on the same layer as normal DOM elements */
        z-index: 0;
    }
    .skill-level {
        position: absolute;
        color: white;
        right: -6px;
        bottom: -4px;
        text-align: center;
        width: 12px;
        height: 10px;
        font-size: 9px;
        padding: 1px;
        background-color: rgba(0, 0, 0, 0.7);
        border: 1px solid #ceae0f;
        border-radius: 2px;
    }
    .mask {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
    }
</style>
