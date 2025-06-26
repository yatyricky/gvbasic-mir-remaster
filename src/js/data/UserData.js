import { Items } from "../config/Item";
import { UnitById } from "../config/Unit";
import Const from "../Const";
import { arrGetOne } from "../Utils";
import ItemInstance from "./ItemInstance";
import { mathRandomIncl } from "./MathLab";
import ReactStat from "./ReactStat";

class UserData {
    constructor() {
        this.data = this.loadFromDisk();

        this.anyaRefreshGoods = true;
        /**@type {ItemSaveData[]} */
        this.anyaGoods = [];
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
     * @param {UnitId} id 
     * @param {string} name
     */
    addChar(id, name) {
        const config = UnitById[id];
        /**@type {UnitSaveData} */
        const char = {
            name,
            unitId: id,
            stats: ReactStat.parseConfig(config.baseStat),
            inventory: {},
            charmBag: [],
            bag: [],
            skills: {},
        }
        let chars = this.data.chars;
        if (chars == null) {
            chars = [];
            this.data.chars = chars;
        }
        // add 1 skill point
        char.stats.skpts = { value: Const.INIT_SK_PTS };
        char.stats.expmax = { value: Const.BASE_EXP_MAX };
        chars.push(char);
        this.saveToDisk();
    }

    /**
     * 
     * @returns {ItemSaveData[]}
     */
    getAnyaShopGoods() {
        // if (!this.refreshGoods) {
        //     return this.anyaGoods;
        // }

        this.anyaRefreshGoods = false;
        const count = mathRandomIncl(200, 400);
        this.anyaGoods = [];
        /**@type {ItemId[]} */
        const candidates = [];

        // for (const e of Items) {
        //     if (e.maxQuality != null) {
        //         candidates.push(e.id);
        //     }
        // }
        for (const e of Items) {
            if ((e.classOnly ?? []).includes("warr")) {
                candidates.push(e.id);
            }
        }

        candidates.push("prismademonstaff", "guardhalb", "palmthunder");

        for (let i = 0; i < count; i++) {
            const item = ItemInstance.drop(arrGetOne(candidates), 60, 0);
            this.anyaGoods.push(item);
        }

        return this.anyaGoods;
    }
}

const userData = new UserData();
export default userData;