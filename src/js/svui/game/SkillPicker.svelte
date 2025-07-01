<script>
    import { SkillById } from "../../config/Skill";
    import SceneManager from "../../SceneManager";
    import UnitComponent from "../../components/UnitComponent";
    import Const from "../../Const";

    const { close, bar, pos, onSkillPicked } = $props();

    const hero = SceneManager.activeScene.find("game/hero").getComponent(UnitComponent);

    // Get all skills from all classes, since players can gain skills from other classes
    const availableSkills = Object.values(SkillById);

    // Filter skills that the hero has learned (skill level > 0)
    const learnedSkills = availableSkills.filter(
        (skill) => hero.getSkillLevel(skill.id).val > 0 && SkillById[skill.id].passive !== true,
    );

    /**
     *
     * @param {SkillId} skillId
     */
    function pickSkill(skillId) {
        onSkillPicked?.(bar, pos, skillId);
        close();
    }
</script>

<div class="backdrop">
    <div class="wrapper">
        <div class="title">
            <div class="title-text">选择技能</div>
            <button onclick={close} class="btn close-btn">X</button>
        </div>
        <div class="container">
            <div class="content">
                <div class="skill-list">
                    {#each learnedSkills as skill (skill.id)}
                        {@const skillLevel = hero.getSkillLevel(skill.id)}
                        <button class="skill-row" onclick={() => pickSkill(skill.id)}>
                            <div class="skill-icon-container">
                                <div
                                    class="skill-icon"
                                    style={`background-image: url('${new URL(`../../../assets/images/${skill.icon}.jpg`, import.meta.url).href}');`}
                                ></div>
                            </div>
                            <div class="skill-info">
                                <span class="skill-name">{skill.name}</span>
                                <span class="skill-level">
                                    等级{skillLevel.base}
                                    {#if skillLevel.ext > 0}
                                        <span style={`color: ${Const.QUALITY_COLOR_FG[1]};`}>+ {skillLevel.ext}</span>
                                    {/if}
                                </span>
                            </div>
                        </button>
                    {/each}
                    <!-- Remove skill option -->
                    <button class="skill-row" onclick={() => pickSkill(null)}>
                        <div class="skill-icon-container">
                            <div class="skill-icon remove-skill-icon">
                                <svg class="remove-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                                    <line x1="5.17" y1="18.83" x2="18.83" y2="5.17" stroke="currentColor" stroke-width="2"/>
                                </svg>
                            </div>
                        </div>
                        <div class="skill-info">
                            <span class="skill-name">删除键位</span>
                        </div>
                    </button>
                    {#if learnedSkills.length === 0}
                        <div class="no-skills">没有可用的技能</div>
                    {/if}
                </div>
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
        width: 94%;
        height: 64%;
        left: 3%;
        top: 18%;
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
        display: flex;
        flex-direction: column;
        padding: 4px;
        border-radius: 4px;
        overflow: hidden;
        gap: 6px;
    }

    .content {
        flex: 1;
        padding: 4px;
        overflow-y: auto;
    }

    .content::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
    }

    .skill-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .skill-row {
        display: flex;
        align-items: center;
        padding: 8px;
        background-color: rgba(35, 32, 31, 0.5);
        border-radius: 4px;
        gap: 12px;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .skill-row:hover {
        background-color: rgba(35, 32, 31, 0.8);
    }

    .skill-icon-container {
        flex-shrink: 0;
    }

    .skill-icon {
        width: 32px;
        height: 32px;
        background-size: cover;
        background-position: center;
        background-color: #4d4540;
        border-radius: 4px;
        pointer-events: none;
    }

    .skill-info {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .skill-name {
        color: #ffffff;
        font-size: 14px;
        font-weight: bold;
    }

    .skill-level {
        color: #cccccc;
        font-size: 12px;
    }

    .no-skills {
        text-align: center;
        color: #999;
        padding: 20px;
        font-style: italic;
    }

    .remove-skill-icon {
        background-color: #680000;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .remove-icon {
        color: #ceae0f;
        width: 20px;
        height: 20px;
    }
</style>
