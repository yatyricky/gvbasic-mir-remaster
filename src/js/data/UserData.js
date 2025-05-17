import { HeroById } from "../configData/Hero";

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
     * @param {number} id 
     */
    addChar(id) {
        const config = HeroById[id];
        /**@type {IUnit} */
        const char = {
            heroId: config.id,
            stats: { ...config.baseStat },
            inventory: [],
            bag: [],
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