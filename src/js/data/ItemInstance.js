import { AffixById, AffixGroupByAvailOn } from "../config/Affix";
import { ItemById, ItemGroupByType } from "../config/Item";
import { StatById } from "../config/Stat";
import { UnitById } from "../config/Unit";
import Const from "../Const";
import { arrGetOne, arrGetSome, arrGroupBy, arrIsEmpty, arrRemove, objEntries, objIsEmpty, objKeys } from "../Utils";
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

        // random affixes
        if (!objIsEmpty(itemConfig.randomAffix)) {
            const randomAffixesKeys = objKeys(itemConfig.randomAffix);
            const randomAffixesCount = Math.min(itemConfig.randomAffixCount ?? 1, randomAffixesKeys.length);
            const randomedKeys = arrGetSome(randomAffixesKeys, randomAffixesCount);
            for (const affixId of randomedKeys) {
                baseAffixesRaw.push({ affix: AffixById[affixId], qlvl: itemConfig.randomAffix[affixId] });
            }
        }

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
            let affixCount = Math.max(Math.min(mathWeightedRandom(qualityWeight), Const.LOOT_MAX_AFFIX_BY_QUALITY[itemConfig.maxQuality ?? 4]), minAffixCount);

            if (affixCount > 0) {
                let prefixCount = 0;
                if (Math.random() < 0.5) {
                    prefixCount = Math.floor(affixCount / 2);
                } else {
                    prefixCount = Math.ceil(affixCount / 2);
                }
                const suffixCount = affixCount - prefixCount;

                const candidates = AffixGroupByAvailOn[itemConfig.type]?.filter(e => (e.ilvl ?? 0) <= ilvl) ?? [];
                const placeGroup = arrGroupBy(candidates, "affixType");
                const loop = [{ type: "prefix", count: prefixCount }, { type: "suffix", count: suffixCount }];
                for (const iter of loop) {
                    const affixConfigs = placeGroup.get(iter.type);
                    if (affixConfigs == null || affixConfigs.length === 0) {
                        continue; // No affixes available for this type
                    }
                    for (let i = 0; i < iter.count; i++) {
                        const affix = arrGetOne(affixConfigs);
                        arrRemove(affixConfigs, affix);
                        extAffixesRaw.push({ affix, qlvl: 0 });
                        if (affixConfigs.length === 0) {
                            break; // No more affixes available for this type
                        }
                    }
                }

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
            const candidates = AffixGroupByAvailOn[itemConfig.type]?.filter(e => (e.ilvl ?? 0) <= ilvl) ?? [];
            if (!arrIsEmpty(itemConfig.excludeAffix)) {
                for (const forbid of itemConfig.excludeAffix) {
                    const index = candidates.findIndex(e => e.id === forbid);
                    if (index > -1) {
                        candidates.splice(index, 1);
                    }
                }
            }
            extAffixesRaw.push(...arrGetSome(candidates, commonCount).map(e => ({ affix: e, qlvl: 0 })));
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
        if (allSockets === 0 || allSockets !== ItemInstance.getFilledSocketCount(item) || item.baseStats.rw == null) {
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

            const randomAffixesKeys = objKeys(rwConfig.randomAffix);
            if (randomAffixesKeys.length > 0) {
                const randomKeys = arrGetSome(randomAffixesKeys, Math.min(rwConfig.randomAffixCount ?? 1, randomAffixesKeys.length));
                for (const affixId of randomKeys) {
                    const affix = AffixById[affixId];
                    if (affix == null) {
                        console.error(`Affix with id ${affixId} not found`);
                        continue;
                    }
                    ItemInstance.collapseAffix(affix, item.runeWordStats, item.ilvl, rwConfig.randomAffix[affixId]);
                }
            }

            const commonCount = mathRandomIntIncl(rwConfig.affixCount ?? 0, rwConfig.maxAffixCount ?? 0);
            if (commonCount > 0) {
                const candidates = AffixGroupByAvailOn[itemConfig.type] ?? [];
                const excludeAffix = [...rwConfig.excludeAffix, ...itemConfig.excludeAffix];
                for (const forbid of excludeAffix) {
                    const index = candidates.findIndex(e => e.id === forbid);
                    if (index > -1) {
                        candidates.splice(index, 1);
                    }
                }
                const affixes = arrGetSome(candidates, commonCount);
                for (const affix of affixes) {
                    ItemInstance.collapseAffix(affix, item.runeWordStats, item.ilvl, 0);
                }
            }
            break;
        }
    }
}
