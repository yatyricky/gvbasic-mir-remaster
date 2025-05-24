import { AffixGroupByAvailOn } from "../config/Affix";
import { ItemById } from "../config/Item";
import { UnitById } from "../config/Unit";
import Const from "../Const";
import { arrGetSome, arrGroupBy } from "../Utils";
import { mathRandomInt, mathWeightedRandom } from "./MathLab";

export default class ItemSave {

    static collapseAffix(affix, stats) {
    }

    /**
     * 
     * @param {ItemId} id
     * @param {number} ilvl 
     * @param {number} luck
     * @param {UnitSaveData} dropper
     */
    static drop(id, ilvl, luck, dropper) {
        const config = ItemById[id];
        if (config == null) {
            throw new Error(`Item with id ${id} not found`);
        }

        /**@type {IAffixConfig[]} */
        const affixesRaw = [];
        // normal magic items
        if (config.quality === 0) {
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
            let quality = mathWeightedRandom(qualityWeight);
            let affixCount = 0;
            if (quality === 1) {
                affixCount = mathWeightedRandom(Const.LOOT_AFFIX_COUNT_GREEN) + 1;
            } else if (quality === 2) {
                affixCount = mathWeightedRandom(Const.LOOT_AFFIX_COUNT_BLUE) + 3;
            }

            const candidates = AffixGroupByAvailOn[config.type];

            const placeGroup = arrGroupBy(candidates, "affixType", "id");
            const prefixes = placeGroup.get("prefix");
            const suffixes = placeGroup.get("suffix");
            let pCount = 0;
            let sCount = 0;
            while (affixCount > 0) {
                const pSize = prefixes.size;
                const sSize = suffixes.size;
                const allSize = pSize + sSize;
                if (allSize === 0) {
                    break;
                }
                const index = mathRandomInt(0, allSize);
                if (index < pSize) {
                    const affix = Array.from(prefixes.values())[index];
                    prefixes.delete(affix.id);
                    affixesRaw.push(affix);
                    pCount++;
                } else {
                    const affix = Array.from(suffixes.values())[index - pSize];
                    suffixes.delete(affix.id);
                    affixesRaw.push(affix);
                    sCount++;
                }
                affixCount--;

                if (pCount + sCount === 1) {
                    if (pCount === 1 && sSize > 0) {
                        const index = mathRandomInt(0, sSize);
                        const affix = Array.from(suffixes.values())[index];
                        suffixes.delete(affix.id);
                        affixesRaw.push(affix);
                        sCount++;
                        affixCount--;
                    } else if (sCount === 1 && pSize > 0) {
                        const index = mathRandomInt(0, pSize);
                        const affix = Array.from(prefixes.values())[index];
                        prefixes.delete(affix.id);
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
        }

        const stats = {};
        for (const affix of affixesRaw) {
            ItemSave.collapseAffix(affix, stats, qlvl);
        }

        /**@type {ItemSaveData} */
        const item = {
            id: id,

            ilvl: ilvl,
            stats: config.stats,
            affixes: config.affixes,
            set: config.set,
            type: config.type,
            name: config.name,
            baseStat: config.baseStat,
        };
    }
}
