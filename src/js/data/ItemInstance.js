import { AffixById, AffixGroupByAvailOn } from "../config/Affix";
import { ItemById, ItemGroupByType } from "../config/Item";
import { StatById } from "../config/Stat";
import { UnitById } from "../config/Unit";
import Const from "../Const";
import { arrGetOne, arrGetSomeWeighted, arrIsEmpty, arrRemove, objEntries, objIsEmpty } from "../Utils";
import { mathClamp, mathFluctuate, mathRandomIncl, mathRandomIntIncl, mathWeightedRandom } from "./MathLab";

export default class ItemInstance {

    /**
     * 
     * @param {IAffixConfig} affix 
     * @param {StatData} stats 
     * @param {number} ilvl 
     * @param {number} qlvl 
     */
    static collapseAffix(affix, stats, ilvl, qlvl) {
        if (affix.ilvlScale != null) {
            ilvl = affix.ilvlScale;
        }
        const statConfig = StatById[affix.statId];
        const ilvlFactor = Math.min(ilvl / 10, Const.MAX_ILVL_FACTOR);
        const a = (affix.lo + affix.loIlvlDelta * ilvlFactor) * (1 + qlvl);
        const b = (affix.hi + affix.hiIlvlDelta * ilvlFactor) * (1 + qlvl);
        let val;
        let val2;
        if (statConfig.type === "number") {
            val = mathRandomIncl(a, b);
            if (stats[affix.statId] == null) {
                stats[affix.statId] = { value: val };
            } else {
                stats[affix.statId].value += val;
            }
        } else if (statConfig.type === "int") {
            val = Math.round(mathRandomIncl(a, b));
            if (stats[affix.statId] == null) {
                stats[affix.statId] = { value: val };
            } else {
                stats[affix.statId].value += val;
            }
        } else if (statConfig.type === "range") {
            val = mathFluctuate(a, affix.fluctuate ?? 0);
            if (a === b) {
                val2 = val;
            } else {
                val2 = mathFluctuate(b, affix.fluctuate ?? 0);
            }
            if (stats[affix.statId] == null) {
                stats[affix.statId] = { range: [val, val2] };
            } else {
                const tuple = stats[affix.statId].range;
                tuple[0] += val;
                tuple[1] += val2;
            }
        } else if (statConfig.type === "skillList") {
            let list = stats[affix.statId];
            if (list == null) {
                list = { skillList: [] };
                stats[affix.statId] = list;
            }
            list.skillList.push({ skill: affix.skill, level: mathRandomIncl(a, b), chance: mathRandomIncl(affix.skillChance[0], affix.skillChance[1]) });
        } else {
            throw new Error(`Unknown stat type ${statConfig.type}`);
        }
    }

    /**
     * 
     * @param {IAddedAffix[]} extAffixesRaw 
     * @param {IItemConfig} itemConfig
     */
    static addRandomAffixes(extAffixesRaw, itemConfig) {
        if (!arrIsEmpty(itemConfig.randomAffix)) {
            for (let i = 0; i < itemConfig.randomAffix.length; i++) {
                const cfg = itemConfig.randomAffix[i];
                const count = itemConfig.randomAffixCount[i] ?? 1;

                const cfgs = objEntries(cfg);
                const weights = cfgs.map(e => AffixById[e[0]].weight ?? 100);
                for (const [affixId, qlvl] of arrGetSomeWeighted(cfgs, weights, count)) {
                    extAffixesRaw.push({ affix: AffixById[affixId], qlvl });
                }
            }
        }
    }

    /**
     * 
     * @param {IAddedAffix[]} extAffixesRaw 
     * @param {number} affixCount
     * @param {IItemConfig} itemConfig
     * @param {number} ilvl
     */
    static addCommonAffixes(extAffixesRaw, affixCount, itemConfig, ilvl) {
        const excludedAffixes = itemConfig.excludeAffix ?? [];
        const excludedGroups = new Set();
        for (const e of extAffixesRaw) {
            if (!arrIsEmpty(e.affix.groupExclusive)) {
                for (const group of e.affix.groupExclusive) {
                    excludedGroups.add(group);
                }
            }
        }
        const candidates = AffixGroupByAvailOn[itemConfig.type]?.filter(e => {
            if ((e.ilvl ?? 0) > ilvl) {
                return false; // Affix is not available for this item level
            }
            if (excludedAffixes.includes(e.id)) {
                return false; // Affix is excluded from this item
            }
            if (!arrIsEmpty(e.group) && e.group.some(group => excludedGroups.has(group))) {
                return false; // Affix is in a group that is excluded
            }
            return true;
        }) ?? [];
        for (let i = 0; i < affixCount; i++) {
            const affix = arrGetOne(candidates);
            arrRemove(candidates, affix);
            extAffixesRaw.push({ affix, qlvl: 0 });
            if (!arrIsEmpty(affix.group)) {
                for (let j = candidates.length - 1; j >= 0; j--) {
                    const currConfig = candidates[j];
                    if (!arrIsEmpty(currConfig.groupExclusive) && affix.group.some(e => currConfig.groupExclusive.includes(e))) {
                        candidates.splice(j, 1); // Remove affixes that are exclusive to the current group
                    }
                }
            }
            if (candidates.length === 0) {
                break; // No more affixes available for this type
            }
        }
    }

    /**
     * 
     * @param {ItemId} id
     * @param {number} ilvl 
     * @param {number} luck
     * @param {UnitSaveData} [dropper]
     */
    static drop(id, ilvl, luck, dropper) {
        const itemConfig = ItemById[id];
        if (itemConfig == null) {
            throw new Error(`Item with id ${id} not found`);
        }

        /**@type {Array<IAddedAffix>} */
        const baseAffixesRaw = [];
        /**@type {Array<IAddedAffix>} */
        const extAffixesRaw = [];

        // base stats
        if (!objIsEmpty(itemConfig.fixedAffix)) {
            for (const [affixId, qlvl] of objEntries(itemConfig.fixedAffix)) {
                baseAffixesRaw.push({ affix: AffixById[affixId], qlvl });
            }
        }

        ItemInstance.addRandomAffixes(extAffixesRaw, itemConfig);

        let name = itemConfig.name;
        let quality = itemConfig.quality;
        const minAffixCount = Const.LOOT_ITEM_QUALITY_2_MIN_AFFIX_COUNT[quality];
        // normal magic items
        if (itemConfig.maxQuality != null) {
            /**@type {UnitType} */
            let dropperType = "mob";
            if (dropper != null) {
                const dropperConfig = UnitById[dropper.unitId];
                if (dropperConfig == null) {
                    throw new Error(`Unit with id ${dropper.unitId} not found`);
                }
                dropperType = dropperConfig.type;
            }
            let qualityWeight;
            if (dropperType === "elite") {
                qualityWeight = [...Const.LOOT_AFFIX_COUNT_ELITE];
            } else if (dropperType === "boss") {
                qualityWeight = [...Const.LOOT_AFFIX_COUNT_BOSS];
            } else {
                qualityWeight = [...Const.LOOT_AFFIX_COUNT_COMMON];
            }
            for (let i = 0; i < qualityWeight.length; i++) {
                const pow = Math.pow(10, i);
                const val = qualityWeight[i];
                const subtract = Math.min(Math.floor(luck / pow), val);
                if (subtract <= 0) {
                    break;
                }
                qualityWeight[i] = val - subtract;
                luck -= subtract * pow;
            }
            qualityWeight[qualityWeight.length - 1] = Math.max(qualityWeight[qualityWeight.length - 1], 1); // Ensure the last value is not negative
            let affixCount = Math.max(Math.min(mathWeightedRandom(qualityWeight), Const.LOOT_MAX_AFFIX_BY_QUALITY[itemConfig.maxQuality ?? 4]), minAffixCount);

            if (affixCount > 0) {
                ItemInstance.addCommonAffixes(extAffixesRaw, affixCount, itemConfig, ilvl);

                /**@type {Record<AffixType, IAddedAffix[]>} */
                const addedAffixes = extAffixesRaw.reduce((acc, e) => {
                    if (acc[e.affix.affixType] == null) {
                        acc[e.affix.affixType] = [];
                    }
                    acc[e.affix.affixType].push(e);
                    return acc;
                }, /**@type {Record<AffixType, IAddedAffix[]>} */({}));
                const prefix = arrGetOne(addedAffixes["prefix"]);
                const suffix = arrGetOne(addedAffixes["suffix"]);
                if (suffix != null) {
                    name = `${suffix.affix.name}${name}`;
                }
                if (prefix != null) {
                    name = `${prefix.affix.name}${name}`;
                }

                quality = Const.LOOT_AFFIX_COUNT_2_QUALITY[mathClamp(extAffixesRaw.length, 0, Const.LOOT_AFFIX_COUNT_2_QUALITY.length - 1)] ?? 0;
            } else {
                // socket items
                if (Math.random() < Const.SOCKET_ITEM_CHANCE) {
                    const candidates = AffixGroupByAvailOn[itemConfig.type]?.filter(e => e.statId === "sok" && ilvl >= (e.ilvl ?? 0)) ?? [];
                    const sel = mathWeightedRandom(candidates.map(e => e.weight));
                    const affix = candidates[sel];
                    if (affix != null) {
                        baseAffixesRaw.push({ affix, qlvl: 0 });
                        baseAffixesRaw.push({ affix: AffixById["rw1"], qlvl: 0 });
                    }
                }
            }
        }

        const commonCount = mathRandomIntIncl(itemConfig.affixCount ?? 0, itemConfig.maxAffixCount ?? 0);
        if (commonCount > 0) {
            ItemInstance.addCommonAffixes(extAffixesRaw, commonCount, itemConfig, ilvl);
        }

        let level = itemConfig.level;
        /**@type {StatData} */
        const baseStats = {};
        for (const e of baseAffixesRaw) {
            ItemInstance.collapseAffix(e.affix, baseStats, ilvl, e.qlvl);
            level = Math.max(level, e.affix.level ?? 0);
        }

        /**@type {StatData} */
        const extStats = {};
        for (const e of extAffixesRaw) {
            ItemInstance.collapseAffix(e.affix, extStats, ilvl, e.qlvl);
            level = Math.max(level, e.affix.level ?? 0);
        }

        if (quality >= 1 && quality <= 2 && extStats.sok != null) {
            // item type constraint
            const socketConstraint = ItemById[id].sockets;
            if (socketConstraint != null) {
                extStats.sok.value = Math.min(Const.AFFIXID_2_SOCKET_COUNT[socketConstraint], extStats.sok.value);
            }

            // item quality constraint
            extStats.sok.value = Math.min(Const.QUALITY_SOCKET_COUNT[quality], extStats.sok.value);
        }

        /**@type {ItemSaveData} */
        const item = {
            uuid: crypto.randomUUID(),
            id,
            name,
            ilvl,
            level,
            quality,
            baseStats,
            extStats,
            sockets: {},
        };

        return item;
    }

    /**
     * 
     * @param {ItemSaveData} item 
     */
    static getSocketCount(item) {
        let count = 0;
        for (const [k, v] of Object.entries(item.baseStats)) {
            if (k === "sok") {
                count += v.value;
            }
        }
        for (const [k, v] of Object.entries(item.extStats)) {
            if (k === "sok") {
                count += v.value;
            }
        }
        return count;
    }

    /**
     * 
     * @param {ItemSaveData} item 
     */
    static getFilledSocketCount(item) {
        let count = 0;
        for (const [, v] of objEntries(item.sockets)) {
            if (v != null) {
                count++;
            }
        }
        return count;
    }

    /**
     * 
     * @param {ItemSaveData} item 
     */
    static runeWordCarving(item) {
        const allSockets = ItemInstance.getSocketCount(item);
        if (allSockets === 0 || allSockets !== ItemInstance.getFilledSocketCount(item) || (item.baseStats.rw == null && item.extStats.rw == null)) {
            return;
        }
        const itemConfig = ItemById[item.id];
        for (const rwConfig of ItemGroupByType.runeword) {
            if (rwConfig.rwOrder.length !== allSockets) {
                continue;
            }
            if (!rwConfig.rwTypes.includes(itemConfig.type)) {
                continue;
            }
            if (rwConfig.rwOrder.some((runeId, seq) => {
                const socketedItem = item.sockets[seq.toString()];
                return socketedItem == null || socketedItem.id !== runeId;
            })) {
                continue;
            }
            item.runeWord = rwConfig.id;
            item.runeWordStats = {};

            for (const [statId, qlvl] of objEntries(rwConfig.fixedAffix)) {
                const affix = AffixById[statId];
                if (affix == null) {
                    console.error(`Affix with id ${statId} not found`);
                    continue;
                }
                ItemInstance.collapseAffix(affix, item.runeWordStats, item.ilvl, qlvl);
            }

            /**@type {IAddedAffix[]} */
            const extAffixes = [];
            ItemInstance.addRandomAffixes(extAffixes, rwConfig);
            const commonCount = mathRandomIntIncl(rwConfig.affixCount ?? 0, rwConfig.maxAffixCount ?? 0);
            if (commonCount > 0) {
                ItemInstance.addCommonAffixes(extAffixes, commonCount, itemConfig, item.ilvl);
            }

            for (const { affix, qlvl } of extAffixes) {
                ItemInstance.collapseAffix(affix, item.runeWordStats, item.ilvl, qlvl);
            }
            break;
        }
    }
}
