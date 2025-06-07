import { ItemById } from "../config/Item";
import { StatById, Stats } from "../config/Stat";
import { arrGetClamped, objEntries, objKeys } from "../Utils";
import { mathRandomIncl, mathRandomIntIncl } from "./MathLab";
import Range from "./Range";

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
            this.data[key] = value;
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
            }
        }
        this.data.rthp.value = Math.min(prevRtHp, this.data.rtmaxhp.value);
        this.data.rtmp.value = Math.min(prevRtMp, this.data.rtmaxmp.value);
    }
}