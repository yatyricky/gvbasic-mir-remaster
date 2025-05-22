import { UnitById } from "../config/Unit";
import ReactStat from "./ReactStat";

class UserData {
    constructor() {
        this.data = this.loadFromDisk();
    }

    loadFromDisk() {
        const json = localStorage.getItem('data');
        /**@type {ISaveData} */
        let obj = {};
        try {
            obj = JSON.parse(json);
        } catch (error) {
        }
        if (obj == null) {
            obj = {};
        }
        return obj;
    }

    saveToDisk() {
        localStorage.setItem('data', JSON.stringify(this.data));
    }

    /**
     * 
     * @param {UnitId} id 
     */
    addChar(id) {
        const config = UnitById[id];
        /**@type {UnitSaveData} */
        const char = {
            unitId: id,
            stats: ReactStat.collapseConfig(config.baseStat),
            inventory: [],
            bag: [],
            skills: [],
        }
        let chars = this.data.chars;
        if (chars == null) {
            chars = [];
            this.data.chars = chars;
        }
        chars.push(char);
        this.saveToDisk();
    }
}

const userData = new UserData();
export default userData;