import { StatById } from "../configData/Stat";
import { Stat } from "../configRaw/Stat";

export default class ReactStat {
    /**
     * 
     * @param {Record<import("../configData/Stat").StatId, any>} baseStat 
     */
    constructor(baseStat) {
        this.eventMap = new Map();

        this.data = /**@type {Record<import("../configData/Stat").StatId, any>} */ ({});
        for (const statConfig of Stat) {
            switch (statConfig.type) {
                case "number":
                    this.data[statConfig.id] = 0;
                    break;
                case "range":
                    this.data[statConfig.id] = {
                        min: 0,
                        max: 0,
                    };
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
            this.setStat(/**@type {import("../configData/Stat").StatId} */(key), value);
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
     * @param {import("../configData/Stat").StatId} key 
     */
    getStat(key) {
        return this.data[key];
    }

    /**
     * 
     * @param {import("../configData/Stat").StatId} key 
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
     * @param {import("../configData/Stat").StatId} key 
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
                curr.min += value.min;
                curr.max += value.max;
                this.setStat(key, undefined, true);
                break;
            case "set":
                let s = /**@type {string} */(value);
                let insert = true;
                if (s.startsWith("-")) {
                    insert = false;
                    s = s.substring(1);
                }
                const index = curr.indexOf(s);
                if (insert) {
                    if (index === -1) {
                        curr.push(s);
                    }
                } else {
                    if (index > -1) {
                        curr.splice(index, 1);
                    }
                }
                this.setStat(key, undefined, true);
                break;

            default:
                break;
        }
    }

    /**
     * 
     * @param {import("../configData/Stat").StatId} key 
     * @param {(d: Record<import("../configData/Stat").StatId, any>) => void} callback 
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
     * @param {import("../configData/Stat").StatId} key 
     * @param {(d: Record<import("../configData/Stat").StatId, any>) => void} callback 
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
}