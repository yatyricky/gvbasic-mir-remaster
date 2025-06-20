import { AffixById } from "../config/Affix";
import { ItemById } from "../config/Item";
import { ItemSetGroupBySetStat } from "../config/ItemEx";
import { StatById, Stats } from "../config/Stat";
import { arrGetClamped, objEntries, objKeys } from "../Utils";
import ItemInstance from "./ItemInstance";
import { mathRandomIncl, mathRandomIntIncl } from "./MathLab";
import Range from "./Range";

const ExpTable = [0, 100];
for (let i = 2; i < 60; i++) {
    ExpTable[i] = Math.floor(ExpTable[i - 1] * 1.2);
}
/**@type {number[]} */
let ExpTableRunningSum = [];
for (let i = 0; i < ExpTable.length; i++) {
    if (i === 0) {
        ExpTableRunningSum[i] = ExpTable[i];
    } else {
        ExpTableRunningSum[i] = ExpTableRunningSum[i - 1] + ExpTable[i];
    }
}

export default class ReactStat {
    /**
     * 
     * @param {StatData} baseStat 
     */
    constructor(baseStat) {
        this.eventMap = new Map();
        this.initBaseStat(baseStat);
    }

    /**
     * 
     * @param {StatData} baseStat 
     */
    initBaseStat(baseStat) {
        this.level = ReactStat.calcLevel(baseStat.exp?.value ?? 0);
        this.on("exp", this.updateLevel.bind(this));
        /**@type {StatData} */
        this.data = {};
        for (const statConfig of Stats) {
            switch (statConfig.type) {
                case "int":
                case "number":
                    this.data[statConfig.id] = { value: 0 };
                    break;
                case "range":
                    this.data[statConfig.id] = { range: [0, 0] };
                    break;
                case "set":
                    this.data[statConfig.id] = { set: {} };
                    break;
                case "skillList":
                    this.data[statConfig.id] = { skillList: [] };
                    break;
                default:
                    throw new Error(`Unknown stat type: ${statConfig.type}`);
            }

            if (statConfig.depends != null) {
                for (const dependency of statConfig.depends) {
                    if (!this.eventMap.has(dependency)) {
                        this.eventMap.set(dependency, []);
                    }
                    this.callbacks = this.eventMap.get(dependency);
                    this.callbacks.push(statConfig.derived);
                }
            }
        }
        for (const [key, value] of objEntries(baseStat)) {
            this.setStat(key, value);
        }

        if (this.data.rthp.value === 0) {
            this.data.rthp.value = this.data.rtmaxhp.value;
        }
        if (this.data.rtmp.value === 0) {
            this.data.rtmp.value = this.data.rtmaxmp.value;
        }
    }

    /**
     * 
     * @param {Partial<Record<StatId, number[]>>} statConfig 
     */
    static collapseConfig(statConfig) {
        /**@type {StatData} */
        const ret = {};
        for (const [id, arr] of objEntries(statConfig)) {
            const config = StatById[id];
            if (config == null) {
                console.error(`Stat ${id} not found`);
                continue;
            }
            switch (config.type) {
                case "number":
                    ret[id] = { value: mathRandomIncl(arrGetClamped(arr, 0), arrGetClamped(arr, 1)) };
                    break;
                case "int":
                    ret[id] = { value: mathRandomIntIncl(arrGetClamped(arr, 0), arrGetClamped(arr, 1)) };
                    break;
                case "range":
                    ret[id] = { range: [mathRandomIncl(arrGetClamped(arr, 0), arrGetClamped(arr, 1)), mathRandomIncl(arrGetClamped(arr, 2), arrGetClamped(arr, 3))] };
                    break;
                case "set":
                    ret[id] = { set: {} };
                    for (const s of arr) {
                        ret[id].set[s.toString()] = 1;
                    }
                    break;
                default:
                    throw new Error(`Unknown stat type: ${config.type}`);
            }
        }
        return ret;
    }

    /**
     * 
     * @param {StatId} key 
     */
    getStat(key) {
        return this.data[key];
    }

    /**
     * 
     * @param {StatId} key 
     * @param {StatValueSaveData} value 
     * @param {boolean} [fireOnly] value is already set, only fire event
     */
    setStat(key, value, fireOnly) {
        if (value !== undefined) {
            this.data[key] = { ...value };
        }
        if (fireOnly || value !== undefined) {
            if (this.eventMap.has(key)) {
                const callbacks = this.eventMap.get(key);
                for (const callback of callbacks) {
                    if (callback != null) {
                        callback(this);
                    }
                }
            }
        }
    }

    /**
     * 
     * @param {StatId} key 
     * @param {StatValueSaveData} value 
     */
    addStat(key, value) {
        const curr = this.data[key];
        const type = StatById[key].type;
        switch (type) {
            case "int":
            case "number":
                curr.value += value.value;
                if (value.value !== 0) {
                    this.setStat(key, undefined, true);
                }
                break;
            case "range":
                curr.range[0] += value.range[0];
                curr.range[1] += value.range[1];
                if (!Range.isZero(value.range)) {
                    this.setStat(key, undefined, true);
                }
                break;
            case "set":
                let changed = false;
                for (const key of objKeys(value.set)) {
                    if (curr.set[key] == null) {
                        curr.set[key] = 1;
                        changed = true;
                    }
                }
                if (changed) {
                    this.setStat(key, undefined, true);
                }
                break;
            case "skillList":
                curr.skillList.push(...value.skillList);
                if (value.skillList.length > 0) {
                    this.setStat(key, undefined, true);
                }
                break;
            default:
                throw new Error(`Unknown stat type: ${type}`);
        }
    }

    /**
     * 
     * @param {StatId} key 
     * @param {StatValueSaveData} value 
     */
    subStat(key, value) {
        const curr = this.data[key];
        const type = StatById[key].type;
        switch (type) {
            case "int":
            case "number":
                curr.value -= value.value;
                if (value.value !== 0) {
                    this.setStat(key, undefined, true);
                }
                break;
            case "range":
                curr.range[0] -= value.range[0];
                curr.range[1] -= value.range[1];
                if (!Range.isZero(value.range)) {
                    this.setStat(key, undefined, true);
                }
                break;
            case "set":
                let changed = false;
                for (const key of objKeys(value.set)) {
                    if (curr.set[key] != null) {
                        delete curr.set[key];
                        changed = true;
                    }
                }
                if (changed) {
                    this.setStat(key, undefined, true);
                }
                break;
            default:
                throw new Error(`Unknown stat type: ${type}`);
        }
    }

    /**
     * 
     * @param {StatId} key 
     * @param {(d: Record<StatId, number[]>) => void} callback 
     */
    on(key, callback) {
        if (!this.eventMap.has(key)) {
            this.eventMap.set(key, []);
        }
        const callbacks = this.eventMap.get(key);
        callbacks.push(callback);
    }

    /**
     * 
     * @param {StatId} key 
     * @param {(d: Record<StatId, number[]>) => void} callback 
     */
    off(key, callback) {
        if (this.eventMap.has(key)) {
            const callbacks = this.eventMap.get(key);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    /**
     * 
     * @param {UnitSaveData} saveData 
     */
    update(saveData) {
        const prevRtHp = this.data.rthp.value;
        const prevRtMp = this.data.rtmp.value;
        this.initBaseStat(saveData.stats);
        // skill stats
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
                    this.addStat(statId, stat);
                }
                for (const [statId, stat] of objEntries(item.extStats)) {
                    this.addStat(statId, stat);
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
                        this.addStat(statId, stat);
                    }
                    for (const [statId, stat] of objEntries(socketItem.extStats)) {
                        this.addStat(statId, stat);
                    }
                }
                // runeword stats
                for (const [statId, stat] of objEntries(item.runeWordStats)) {
                    this.addStat(statId, stat);
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
                if (items + this.getStat("setany").value < entry.setCount) {
                    continue; // not enough items to complete the set
                }
                /**@type {StatData}*/
                const tempStats = {};
                for (const [affixId, qlvl] of objEntries(entry.fixedAffix)) {
                    ItemInstance.collapseAffix(AffixById[affixId], tempStats, 0, qlvl);
                }
                for (const [statId, val] of objEntries(tempStats)) {
                    this.addStat(statId, val);
                }
            }
        }
        this.data.rthp.value = Math.min(prevRtHp, this.data.rtmaxhp.value);
        this.data.rtmp.value = Math.min(prevRtMp, this.data.rtmaxmp.value);
    }

    /**
     * 
     * @param {number} exp 
     */
    static calcLevel(exp) {
        for (let i = 1; i < ExpTableRunningSum.length; i++) {
            if (exp < ExpTableRunningSum[i]) {
                return i;
            }
        }
        return ExpTableRunningSum.length; // max level
    }

    updateLevel() {
        const prevLevel = this.level;
        this.level = ReactStat.calcLevel(this.getStat("exp").value);
        const levelDiff = this.level - prevLevel;
        if (levelDiff !== 0) {
            this.addStat("skpts", { value: levelDiff });
        }
    }
}