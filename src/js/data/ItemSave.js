import { AffixGroupByAvailOn } from "../config/Affix";
import { ItemById } from "../config/Item";
import { StatById } from "../config/Stat";
import { UnitById } from "../config/Unit";
import Const from "../Const";
import { arrGetSome, arrGroupBy } from "../Utils";
import { mathFluctuate, mathRandomIncl, mathRandomInt, mathWeightedRandom } from "./MathLab";

export default class ItemSave {

    /**
     * 
     * @param {IAffixConfig} affix 
     * @param {Partial<Record<StatId, any>} stats 
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
            val2 = mathFluctuate(b, affix.fluctuate);
            if (stats[affix.statId] == null) {
                stats[affix.statId] = [val, val2];
            } else {
                const tuple = stats[affix.statId];
                tuple[0] += val;
                tuple[1] += val2;
            }
        } else if (statConfig.type === "set") {
            throw new Error(`Set stat not supported yet`);
        } else {
            throw new Error(`Unknown stat type ${statConfig.type}`);
        }
    }

    /**
     * 
     * @param {ItemId} id
     * @param {number} ilvl 
     * @param {number} qlvl
     * @param {number} luck
     * @param {UnitSaveData} dropper
     */
    static drop(id, ilvl, qlvl, luck, dropper) {
        const itemConfig = ItemById[id];
        if (itemConfig == null) {
            throw new Error(`Item with id ${id} not found`);
        }

        /**@type {IAffixConfig[]} */
        const affixesRaw = [];
        let name = itemConfig.name;
        let quality = itemConfig.quality;
        // normal magic items
        if (itemConfig.quality === 0) {
            const dropperConfig = UnitById[dropper.unitId];
            if (dropperConfig == null) {
                throw new Error(`Unit with id ${dropper.unitId} not found`);
            }
            let qualityWeight = [...Const.LOOT_WEIGHT_MOB];
            if (dropperConfig.type === "elite") {
                qualityWeight = [...Const.LOOT_WEIGHT_ELITE];
            } else if (dropperConfig.type === "boss") {
                qualityWeight = [...Const.LOOT_WEIGHT_BOSS];
            }
            for (let i = 0; i < qualityWeight.length; i++) {
                qualityWeight[i] = qualityWeight[i] * (100 + luck * Const.LOOT_LUCK_COEFFICIENT[i]) / 100;
            }

            qualityWeight = qualityWeight.slice(0, 3);
            quality = mathWeightedRandom(qualityWeight);
            let affixCount = 0;
            if (quality === 1) {
                affixCount = mathWeightedRandom(Const.LOOT_AFFIX_COUNT_GREEN) + 1;
            } else if (quality === 2) {
                affixCount = mathWeightedRandom(Const.LOOT_AFFIX_COUNT_BLUE) + 3;
            }

            const candidates = AffixGroupByAvailOn[itemConfig.type];
            const placeGroup = arrGroupBy(candidates, "affixType");
            const prefixes = placeGroup.get("prefix");
            const suffixes = placeGroup.get("suffix");
            let pCount = 0;
            let sCount = 0;
            while (affixCount > 0) {
                const pSize = prefixes.length;
                const sSize = suffixes.length;
                const allSize = pSize + sSize;
                if (allSize === 0) {
                    break;
                }
                const index = mathRandomInt(0, allSize);
                if (index < pSize) {
                    const affix = prefixes.splice(index, 1)[0];
                    affixesRaw.push(affix);
                    pCount++;
                } else {
                    const affix = suffixes.splice(index - pSize, 1)[0];
                    affixesRaw.push(affix);
                    sCount++;
                }
                affixCount--;

                if (pCount + sCount === 1) {
                    if (pCount === 1 && sSize > 0) {
                        const index = mathRandomInt(0, sSize);
                        const affix = suffixes.splice(index, 1)[0];
                        affixesRaw.push(affix);
                        sCount++;
                        affixCount--;
                    } else if (sCount === 1 && pSize > 0) {
                        const index = mathRandomInt(0, pSize);
                        const affix = prefixes.splice(index, 1)[0];
                        affixesRaw.push(affix);
                        pCount++;
                        affixCount--;
                    }
                }
            }

            if (affixesRaw.length === 0) {
                quality = 0;
            } else if (affixesRaw.length > 2) {
                quality = 2;
            } else if (affixesRaw.length > 0) {
                quality = 1;
            }

            const addedAffixes = arrGroupBy(affixesRaw, "affixType");
            const prefix = arrGetSome(addedAffixes.get("prefix"), 1)[0];
            const suffix = arrGetSome(addedAffixes.get("suffix"), 1)[0];
            if (prefix != null) {
                name = `${prefix.name}${name}`;
            }
            if (suffix != null) {
                name = `${suffix.name}${name}`;
            }
        }

        /**@type {Partial<Record<StatId, number | [number, number]>>} */
        const stats = {};
        for (const affix of affixesRaw) {
            ItemSave.collapseAffix(affix, stats, ilvl, qlvl);
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
