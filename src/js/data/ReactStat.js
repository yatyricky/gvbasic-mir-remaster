import { StatById, Stats } from "../config/Stat";
import { arrGetClamped, arrRemove } from "../Utils";
import { mathRandomIncl } from "./MathLab";
import Range from "./Range";

export default class ReactStat {
    /**
     * 
     * @param {Partial<Record<StatId, any>>} baseStat 
     */
    constructor(baseStat) {
        this.eventMap = new Map();

        this.data = /**@type {Record<StatId, any>} */ ({});
        for (const statConfig of Stats) {
            switch (statConfig.type) {
                case "number":
                    this.data[statConfig.id] = 0;
                    break;
                case "range":
                    this.data[statConfig.id] = [0, 0];
                    break;
                case "set":
                    this.data[statConfig.id] = [];
                    break;
                default:
                    break;
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
        for (const [key, value] of Object.entries(baseStat)) {
            this.setStat(/**@type {StatId} */(key), value);
        }

        if (this.data.rthp === 0) {
            this.data.rthp = this.data.rtmaxhp;
        }
        if (this.data.rtmp === 0) {
            this.data.rtmp = this.data.rtmaxmp;
        }
    }

    /**
     * 
     * @param {Partial<Record<StatId, any>>} statConfig 
     */
    static collapseConfig(statConfig) {
        const ret = /**@type {Record<StatId, any>} */ ({});
        for (const [id, arr] of Object.entries(statConfig)) {
            const config = StatById[/**@type {StatId}*/(id)];
            if (config == null) {
                console.error(`Stat ${id} not found`);
                continue;
            }
            switch (config.type) {
                case "number":
                    ret[/**@type {StatId}*/(id)] = mathRandomIncl(arrGetClamped(arr, 0), arrGetClamped(arr, 1));
                    break;
                case "range":
                    ret[/**@type {StatId}*/(id)] = [mathRandomIncl(arrGetClamped(arr, 0), arrGetClamped(arr, 1)), mathRandomIncl(arrGetClamped(arr, 2), arrGetClamped(arr, 3))];
                    break;
                case "set":
                    ret[/**@type {StatId}*/(id)] = new Set();
                    for (const s of arr) {
                        ret[/**@type {StatId}*/(id)].add(s.toString());
                    }
                    break;
                default:
                    break;
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
     * @param {any} value 
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
     * @param {any} value 
     */
    addStat(key, value) {
        const curr = this.data[key];
        const type = StatById[key].type;
        switch (type) {
            case "number":
                this.setStat(key, curr + value);
                break;

            case "range":
                curr[0] += value[0];
                curr[1] += value[1];
                this.setStat(key, undefined, true);
                break;
            case "set":
                if (curr.includes(value)) {
                    return;
                }
                curr.push(value);
                this.setStat(key, undefined, true);
                break;

            default:
                break;
        }
    }

    /**
     * 
     * @param {StatId} key 
     * @param {any} value 
     */
    subStat(key, value) {
        const curr = this.data[key];
        const type = StatById[key].type;
        switch (type) {
            case "number":
                this.setStat(key, curr - value);
                break;
            case "range":
                curr[0] -= value[0];
                curr[1] -= value[1];
                this.setStat(key, undefined, true);
                break;
            case "set":
                if (!curr.includes(value)) {
                    return;
                }
                arrRemove(curr, value);
                this.setStat(key, undefined, true);
                break;
            default:
                break;
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

    toJson() {

    }
}