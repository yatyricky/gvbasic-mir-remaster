import { AffixById, AffixGroupByAvailOn } from "../config/Affix";
import { ItemById } from "../config/Item";
import { StatById } from "../config/Stat";
import { UnitById } from "../config/Unit";
import Const from "../Const";
import { arrGetOne, arrGetSome, arrGroupBy, arrRemove, objIsEmpty } from "../Utils";
import { mathFluctuate, mathRandomIncl, mathWeightedRandom } from "./MathLab";

export default class ItemInstance {

    /**
     * 
     * @param {IAffixConfig} affix 
     * @param {Partial<Record<StatId, any>>} stats 
     * @param {number} ilvl 
     * @param {number} qlvl 
     */
    static collapseAffix(affix, stats, ilvl, qlvl) {
        const statConfig = StatById[affix.statId];
        const ilvlFactor = Math.min(ilvl / 10, Const.MAX_ILVL_FACTOR);
        const a = (affix.lo + affix.loIlvlDelta * ilvlFactor) * (1 + qlvl);
        const b = (affix.hi + affix.hiIlvlDelta * ilvlFactor) * (1 + qlvl);
        let val;
        let val2;
        if (statConfig.type === "number") {
            val = mathRandomIncl(a, b);
            if (stats[affix.statId] == null) {
                stats[affix.statId] = val;
            } else {
                stats[affix.statId] += val;
            }
        } else if (statConfig.type === "range") {
            val = mathFluctuate(a, affix.fluctuate);
            if (a === b) {
                val2 = val;
            } else {
                val2 = mathFluctuate(b, affix.fluctuate);
            }
            if (stats[affix.statId] == null) {
                stats[affix.statId] = [val, val2];
            } else {
                const tuple = stats[affix.statId];
                tuple[0] += val;
                tuple[1] += val2;
            }
        } else if (statConfig.type === "set") {
            let map = stats[affix.statId];
            if (map == null) {
                map = {};
                stats[affix.statId] = map;
            }
            if (map[affix.skill] == null) {
                map[affix.skill] = mathRandomIncl(a, b);
            } else {
                map[affix.skill] = Math.max(mathRandomIncl(a, b), map[affix.skill]);
            }
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

        /**@type {Array<{affix: IAffixConfig, qlvl: number}>} */
        const affixesRaw = [];

        // base stats
        if (!objIsEmpty(itemConfig.fixedAffix)) {
            for (const [affixId, qlvl] of Object.entries(itemConfig.fixedAffix)) {
                affixesRaw.push({ affix: AffixById[/**@type {AffixId}*/(affixId)], qlvl });
            }
        }

        // random affixes
        if (!objIsEmpty(itemConfig.randomAffix)) {
            const randomAffixesKeys = Object.keys(itemConfig.randomAffix);
            const randomAffixesCount = Math.min(itemConfig.randomAffixCount ?? 1, randomAffixesKeys.length);
            const randomedKeys = arrGetSome(randomAffixesKeys, randomAffixesCount);
            for (const affixId of randomedKeys) {
                affixesRaw.push({ affix: AffixById[/**@type {AffixId}*/(affixId)], qlvl: itemConfig.randomAffix[/**@type {AffixId}*/(affixId)] });
            }
        }

        let name = itemConfig.name;
        let quality = itemConfig.quality;
        // normal magic items
        if (itemConfig.maxQuality != null) {
            let dropperType = "mob";
            if (dropper != null) {
                const dropperConfig = UnitById[dropper.unitId];
                if (dropperConfig == null) {
                    throw new Error(`Unit with id ${dropper.unitId} not found`);
                }
                dropperType = dropperConfig.type;
            }
            let qualityWeight = Const.LOOT_WEIGHT_MOB.slice(quality, itemConfig.maxQuality + 1);
            if (dropperType === "elite") {
                qualityWeight = Const.LOOT_WEIGHT_ELITE.slice(quality, itemConfig.maxQuality + 1);
            } else if (dropperType === "boss") {
                qualityWeight = Const.LOOT_WEIGHT_BOSS.slice(quality, itemConfig.maxQuality + 1);
            }
            for (let i = 0; i < qualityWeight.length; i++) {
                qualityWeight[i] = qualityWeight[i] * (100 + luck * Const.LOOT_LUCK_COEFFICIENT[i + quality]) / 100;
            }

            quality += mathWeightedRandom(qualityWeight);

            if (quality > 0) {
                let affixCount = 0;
                if (quality === 1) {
                    affixCount = mathWeightedRandom(Const.LOOT_AFFIX_COUNT_GREEN) + 1;
                } else if (quality === 2) {
                    affixCount = mathWeightedRandom(Const.LOOT_AFFIX_COUNT_BLUE) + 3;
                }

                let prefixCount = 0;
                if (Math.random() < 0.5) {
                    prefixCount = Math.floor(affixCount / 2);
                } else {
                    prefixCount = Math.ceil(affixCount / 2);
                }
                const suffixCount = affixCount - prefixCount;

                const candidates = AffixGroupByAvailOn[itemConfig.type] ?? [];
                const placeGroup = arrGroupBy(candidates, "affixType");
                const loop = [{ type: "prefix", count: prefixCount }, { type: "suffix", count: suffixCount }];
                const randomedAffixes = [];
                for (const iter of loop) {
                    const affixConfigs = placeGroup.get(iter.type);
                    if (affixConfigs == null || affixConfigs.length === 0) {
                        continue; // No affixes available for this type
                    }
                    for (let i = 0; i < iter.count; i++) {
                        const affix = arrGetOne(affixConfigs);
                        arrRemove(affixConfigs, affix);
                        randomedAffixes.push({ affix, qlvl: 0 });
                    }
                }


                /**@type {any} */
                const addedAffixes = randomedAffixes.reduce((acc, e) => {
                    if (acc[e.affix.affixType] == null) {
                        acc[e.affix.affixType] = [];
                    }
                    acc[e.affix.affixType].push(e);
                    return acc;
                }, /**@type {any} */({}));
                const prefix = arrGetOne(addedAffixes["prefix"]);
                const suffix = arrGetOne(addedAffixes["suffix"]);
                if (suffix != null) {
                    name = `${suffix.affix.name}${name}`;
                }
                if (prefix != null) {
                    name = `${prefix.affix.name}${name}`;
                }

                affixesRaw.push(...randomedAffixes);
            }
        }

        /**@type {Partial<Record<StatId, number | [number, number]>>} */
        const stats = {};
        for (const e of affixesRaw) {
            ItemInstance.collapseAffix(e.affix, stats, ilvl, e.qlvl);
        }

        /**@type {ItemSaveData} */
        const item = {
            id: id,
            name,
            ilvl: ilvl,
            quality,
            stats,
            sockets: {},
        };

        return item;
    }
}
