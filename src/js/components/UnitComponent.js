import { AffixById } from "../config/Affix";
import { ItemById } from "../config/Item";
import { ItemSetGroupBySetStat } from "../config/ItemEx";
import { SkillById } from "../config/Skill";
import { Stats } from "../config/Stat";
import { UnitById } from "../config/Unit";
import Const from "../Const";
import ItemInstance from "../data/ItemInstance";
import ReactStat from "../data/ReactStat";
import userData from "../data/UserData";
import { dispatch } from "../EventBus";
import Formula, { FormulaStats } from "../skill/Formula";
import { arrCombinations, arrIsEmpty, objEntries, objIsEmpty, strFormat } from "../Utils";
import Component from "./Component";

export default class UnitComponent extends Component {
    constructor() {
        super();
        this.isCombat = false;
    }

    /**
     * 
     * @param {UnitSaveData} persistantData 
     */
    initData(persistantData) {
        this.persistantData = persistantData;
        this.config = UnitById[persistantData.unitId];
        this.stat = new ReactStat(persistantData.stats);
        this.updateStat();
        return this;
    }

    getItem() {
    }

    /**
     * 
     * @param {ItemSaveData} item 
     */
    addBagItem(item) {
        this.persistantData.bag.push(item);
        dispatch("bag:refresh", null);
        this.save();
    }

    /**
     * 
     * @param {ItemSaveData} item 
     * @param {boolean} [dontUpdateStat=false]
     */
    tryUnquip(item, dontUpdateStat) {
        const itemConfig = ItemById[item.id];
        const equipped = this.persistantData.inventory[Const.ITEM_TYPE_SLOT[itemConfig.type]];
        const index = equipped.findIndex(e => e.uuid === item.uuid);
        if (index === -1) {
            dispatch("toast", "物品未装备");
            console.error("Item not equipped:", item);
            return false; // Item not equipped
        }

        // Remove the item from the equipped slot
        equipped.splice(index, 1);
        if (!dontUpdateStat) {
            this.updateStat();
        }
        this.persistantData.bag.push(item); // Add it back to the bag
        dispatch("bag:refresh", null);
        dispatch("inventory:refresh", null);
        this.save();
        return true; // Successfully unequipped
    }

    get level() {
        return this.stat.getStat("level").value;
    }

    /**
     * 
     * @param {ItemSaveData} item 
     */
    tryEquipItemFromBag(item) {
        const indexInBag = this.persistantData.bag.findIndex(e => e.uuid === item.uuid);
        if (indexInBag === -1) {
            dispatch("toast", "物品不在背包中");
            console.error("Item not found in bag:", item);
            return false; // Item not found in bag
        }

        if (this.level < item.level) {
            dispatch("toast", `物品等级要求 ${item.level}，当前等级 ${this.level}`);
            return false; // Level requirement not met
        }

        const itemConfig = ItemById[item.id];
        // check if unit class match
        if (!arrIsEmpty(itemConfig.classOnly) && itemConfig.classOnly.includes(this.config.id) === false) {
            dispatch("toast", "无法装备此物品，职业不匹配");
            return false; // Class mismatch
        }

        const slotType = Const.ITEM_TYPE_SLOT[itemConfig.type];
        let equipped = this.persistantData.inventory[slotType];
        if (equipped == null) {
            // Initialize the slot if it doesn't exist
            equipped = [];
            this.persistantData.inventory[slotType] = equipped;
        }
        let unequipped = false;

        if (itemConfig.isUnique) {
            // Check if the item is already equipped
            const existingItem = equipped.find(e => e.id === item.id);
            if (existingItem) {
                this.tryUnquip(existingItem, true);
                unequipped = true; // Mark as unequipped
            }
        } else if (slotType === "arms") {
            // 1. must equip current
            const combinations = arrCombinations(equipped);

            for (const combination of combinations) {
                combination.push(item);
            }
            const policies = Const.EQUIP_POLICY[this.config.id];

            /**@type {ItemSaveData[][]} */
            let successes = [];
            for (const combination of combinations) {
                for (const policy of policies) {
                    if (policy.length !== combination.length) {
                        continue; // Skip if the policy length doesn't match the combination length
                    }
                    // compare each item in the combination with the policy
                    let match = true;
                    for (let i = 0; match && i < policy.length; i++) {
                        if (policy[i] !== Const.ITEM_SUBTYPE[ItemById[combination[i].id].type]) {
                            match = false;
                        }
                    }
                    if (match) {
                        successes.push(combination);
                        break; // No need to check further policies
                    }
                }
            }
            if (successes.length === 0) {
                dispatch("toast", "无法装备此武器");
                return false; // No valid combination found
            }
            successes.sort((a, b) => b.length - a.length);
            for (let i = equipped.length - 1; i >= 0; i--) {
                const e = equipped[i];
                if (!successes[0].includes(e)) {
                    // unequip last item in slot
                    const result = this.tryUnquip(e, true);
                    unequipped = result || unequipped;
                }
            }
        } else {
            for (let i = equipped.length - 1; i >= 0; i--) {
                const currentSize = equipped.reduce((acc, cur) => acc + Const.ITEM_TYPE_SIZE[ItemById[cur.id].type], 0);
                if (currentSize + Const.ITEM_TYPE_SIZE[itemConfig.type] > Const.SLOT_MAX_SIZE[slotType]) {
                    // unequip last item in slot
                    const result = this.tryUnquip(equipped[i], true);
                    unequipped = result || unequipped;
                } else {
                    break;
                }
            }
        }

        if (unequipped) {
            dispatch("toast", "已替换装备");
        }

        // Add the item to the equipped slot
        equipped.push(item);
        this.updateStat();
        this.persistantData.bag.splice(indexInBag, 1); // Remove it from the bag
        dispatch("bag:refresh", null);
        dispatch("inventory:refresh", null);
        this.save();
    }

    getSocketFillers() {
        const fillers = [];
        for (const item of this.persistantData.bag) {
            const itemConfig = ItemById[item.id];
            if (itemConfig.type === "rune") {
                fillers.push(item);
            }
        }
        return fillers;
    }

    /**
     * 
     * @param {string} uuid 
     * @returns {ItemSaveData}
     */
    findItemByUuid(uuid) {
        let item = this.persistantData.bag.find(e => e.uuid === uuid);
        if (item != null) {
            return item;
        }
        for (const [, items] of objEntries(this.persistantData.inventory)) {
            item = items.find(e => e.uuid === uuid);
            if (item != null) {
                return item;
            }
        }
        for (const item of this.persistantData.charmBag) {
            if (item.uuid === uuid) {
                return item;
            }
        }
        return null; // Item not found
    }

    /**
     * 
     * @param {ItemSaveData} svItem 
     * @param {ItemSaveData} socketItem 
     */
    trySocketItem(svItem, socketItem) {
        const item = this.findItemByUuid(svItem.uuid);
        const allSockets = ItemInstance.getSocketCount(item);
        const filledSockets = ItemInstance.getFilledSocketCount(item);
        if (filledSockets >= allSockets) {
            dispatch("toast", "插槽已满");
            return false; // All sockets are filled
        }

        for (let i = 0; i < allSockets; i++) {
            const k = i.toString();
            const v = item.sockets[k];
            if (v != null) {
                continue;
            }
            item.sockets[k] = socketItem;
            break;
        }

        // update level requirement
        item.level = Math.max(item.level, socketItem.level);

        const indexInBag = this.persistantData.bag.findIndex(e => e.uuid === socketItem.uuid);
        this.persistantData.bag.splice(indexInBag, 1); // Remove it from the bag
        ItemInstance.runeWordCarving(item);
        this.updateStat();
        dispatch("bag:refresh", null);
        dispatch("inventory:refresh", null);
        dispatch("item:refresh", item.uuid);
        this.save();
    }

    /**
     * 
     * @param {SkillId} id 
     */
    getLearntSkillLevel(id) {
        return this.persistantData.skills[id] ?? 0;
    }

    /**
     * 
     * @param {SkillId} id 
     */
    upgradeSkill(id) {
        if (this.stat.getStat("skpts").value <= 0) {
            dispatch("toast", "没有技能点");
            return false; // No skill points available
        }
        const config = SkillById[id];
        if (this.stat.getStat("level").value < config.level) {
            dispatch("toast", `技能等级不足，需达到 ${config.level} 级`);
            return false; // Not enough level to learn this skill
        }
        if (!arrIsEmpty(config.prerequisite) && config.prerequisite.some(prereq => this.getLearntSkillLevel(prereq) <= 0)) {
            dispatch("toast", "技能前置条件未满足");
            return false; // Prerequisite skills not met
        }
        if (this.getLearntSkillLevel(id) >= Const.SKILL_MAX_LEVEL) {
            dispatch("toast", "技能已满级");
            return false; // Skill already at max level
        }
        // Upgrade the skill
        this.persistantData.skills[id] = (this.persistantData.skills[id] || 0) + 1;
        this.stat.subStat("skpts", { value: 1 });
        dispatch("skill:refresh", null);
        this.updateStat();
        this.save();
    }

    save() {
        for (const e of Stats) {
            if (e.save !== true) {
                continue; // Skip stats that are not meant to be saved
            }
            this.persistantData.stats[e.id] = this.stat.getStat(e.id);
        }
        userData.saveToDisk();
    }

    /**
     * 
     * @param {number} exp 
     */
    addExp(exp) {
        this.stat.addExp(exp);
        this.save();
    }

    /**
     * @param {SkillId} id
     * @return {SkillTag[]}
     */
    getSkillBranches(id) {
        const cfg = SkillById[id];
        const tags = new Set(cfg.tag);
        for (const e of Stats) {
            if (e.targetSkill !== id) {
                continue; // Skip if not targeting this skill
            }
            if (this.stat.getStat(e.id).value <= 0) {
                continue; // Skip if the stat is not positive
            }
            if (!arrIsEmpty(e.skillTag)) {
                for (const tag of e.skillTag) {
                    tags.add(tag);
                }
            }
            if (!arrIsEmpty(e.rmSkillTag)) {
                for (const tag of e.rmSkillTag) {
                    tags.delete(tag);
                }
            }
        }
        return Array.from(tags);
    }

    /**
     * 
     * @param {SkillId} id 
     * @return {{val: number, base: number, ext: number}}
     */
    getSkillLevel(id) {
        const myBranches = this.getSkillBranches(id);
        const base = this.getLearntSkillLevel(id);
        const itemAddedSkillLevel = Stats.filter(e => e.targetSkill === id && e.isSkillMod !== true && (arrIsEmpty(e.unitConstraint) || e.unitConstraint.includes(this.persistantData.unitId))).reduce((acc, cur) => acc + this.stat.getStat(cur.id).value, 0);
        const branchLevels = Stats.filter(e => ((!arrIsEmpty(e.targetTag) && e.targetTag.some(f => myBranches.includes(f))) && (arrIsEmpty(e.unitConstraint) || e.unitConstraint.includes(this.persistantData.unitId)))).reduce((acc, cur) => acc + this.stat.getStat(cur.id).value, 0);
        if (base + itemAddedSkillLevel > 0) {
            return { val: base + itemAddedSkillLevel + branchLevels, base, ext: itemAddedSkillLevel + branchLevels };
        } else {
            return { val: 0, base: 0, ext: 0 };
        }
    }

    /**
     * 
     * @param {SkillId} skillId 
     * @param {boolean} [showNextLevel=false]
     * @returns 
     */
    getSkillHtml(skillId, showNextLevel = false) {
        const skillLevel = this.getSkillLevel(skillId);
        const config = SkillById[skillId];
        const mods = [];
        for (const e of Stats) {
            if (e.isSkillMod !== true) {
                continue;
            }
            if (e.targetSkill !== skillId) {
                continue;
            }
            const val = this.stat.getStat(e.id).value;
            if (val <= 0) {
                continue;
            }
            mods.push(strFormat(e.description, val));
        }
        return `
            <div style="font-size: 14px;">
                ${this
                .getSkillBranches(skillId)
                .map((t) => `<span style="color: ${Const.SKILL_TAG_COLOR[t]};">${Const.SKILL_TAG_NAME[t]}</span>`)
                .join(", ")}<br/>
                技能等级: ${skillLevel.base}${skillLevel.ext > 0 ? `<span style="color: rgb(30,255,0);">+${skillLevel.ext}</span>` : ""}<br/>
                ${strFormat(config.description.replace(/\n/g, "<br />"), ...Formula[skillId](this))}<br/>
                ${mods.length > 0 ? `<span style="color: rgb(30,255,0);">${mods.join("<br/>")}</span><br/>` : ""}
                <span style="color:${config.level <= this.stat.getStat("level").value ? "white" : "red"}">需要等级: ${config.level}</span>
            </div>
        `;
    }

    /**
     * 
     * @param {StatId} statId 
     * @param {number} value 
     */
    addStat(statId, value) {
        const rthploss = this.stat.getStat("rthploss").value;
        const rtmploss = this.stat.getStat("rtmploss").value;
        const pdStats = this.persistantData.stats;
        pdStats[statId].value = pdStats[statId].value + value;
        this.stat.subStat("atpts", { value });
        this.updateStat();
        this.stat.setStat("rthp", { value: this.stat.getStat("rtmaxhp").value - rthploss });
        this.stat.setStat("rtmp", { value: this.stat.getStat("rtmaxmp").value - rtmploss });
        this.save();
    }

    /**
     */
    updateStat() {
        const saveData = this.persistantData;
        const rs = this.stat;
        const prevRtHp = rs.data.rthp.value;
        const prevRtMp = rs.data.rtmp.value;
        rs.initBaseStat(saveData.stats);
        // skill stats
        for (const [_, func] of objEntries(FormulaStats)) {
            const skillStat = func(this);
            if (objIsEmpty(skillStat)) {
                continue; // no stats to apply
            }
            for (const [statId, stat] of objEntries(skillStat)) {
                rs.addStat(statId, stat);
            }
        }
        // equip stats
        /**@type {Map<StatId, number>}*/
        const wornSets = new Map();
        for (const [, items] of objEntries(saveData.inventory)) {
            for (const item of items) {
                if (item == null) {
                    continue;
                }
                const itemConfig = ItemById[item.id];
                if (itemConfig == null) {
                    console.error(`Item ${item.id} not found`);
                    continue;
                }
                for (const [statId, stat] of objEntries(item.baseStats)) {
                    rs.addStat(statId, stat);
                }
                for (const [statId, stat] of objEntries(item.extStats)) {
                    rs.addStat(statId, stat);
                }
                // socket fillers
                for (const [, socketItem] of objEntries(item.sockets)) {
                    if (socketItem == null) {
                        continue;
                    }
                    const socketConfig = ItemById[socketItem.id];
                    if (socketConfig == null) {
                        console.error(`Socket item ${socketItem.id} not found`);
                        continue;
                    }
                    for (const [statId, stat] of objEntries(socketItem.baseStats)) {
                        rs.addStat(statId, stat);
                    }
                    for (const [statId, stat] of objEntries(socketItem.extStats)) {
                        rs.addStat(statId, stat);
                    }
                }
                // runeword stats
                for (const [statId, stat] of objEntries(item.runeWordStats)) {
                    rs.addStat(statId, stat);
                }
                // set items
                if (itemConfig.setStat != null) {
                    if (!wornSets.has(itemConfig.setStat)) {
                        wornSets.set(itemConfig.setStat, 1);
                    } else {
                        wornSets.set(itemConfig.setStat, wornSets.get(itemConfig.setStat) + 1);
                    }
                }
            }
        }
        // set item stats
        for (const [setId, items] of wornSets) {
            const completion = ItemSetGroupBySetStat[setId];
            for (const entry of completion) {
                if (items + rs.getStat("setany").value < entry.setCount) {
                    continue; // not enough items to complete the set
                }
                /**@type {StatData}*/
                const tempStats = {};
                for (const [affixId, qlvl] of objEntries(entry.fixedAffix)) {
                    ItemInstance.collapseAffix(AffixById[affixId], tempStats, 0, qlvl);
                }
                for (const [statId, val] of objEntries(tempStats)) {
                    rs.addStat(statId, val);
                }
            }
        }
        rs.setStat("rthp", { value: Math.min(prevRtHp, rs.data.rtmaxhp.value) });
        rs.setStat("rtmp", { value: Math.min(prevRtMp, rs.data.rtmaxmp.value) });
    }
}
