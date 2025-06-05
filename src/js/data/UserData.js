import { UnitById } from "../config/Unit";
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
     * 
     * @param {UnitId} id 
     */
    addChar(id) {
        const config = UnitById[id];
        /**@type {UnitSaveData} */
        const char = {
            unitId: id,
            stats: ReactStat.collapseConfig(config.baseStat),
            inventory: {},
            bag: [],
            skills: [],
        }
        let chars = this.data.chars;
        if (chars == null) {
            chars = [];
            this.data.chars = chars;
        }
        // add 1 skill point
        char.stats.skpts = 1;
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
        const candidates = ["clotharmor", "leatherarmor", "grandcharm", "largecharm", "smallcharm", "commonnecklace", "commonring",
            "rune1",
            "rune2",
            "rune3",
            "rune4",
            "rune5",
            "rune6",
            "rune7",
            "rune8",
            "rune9",
            "rune10",
            "rune11",
            "rune12",
            "rune13",
            "rune14",
            "rune15",
            "rune16",
            "rune17",
            "rune18",
            "rune19",
            "rune20",
            "rune21",
            "rune22",
            "rune23",
            "rune24",
            "rune25",

        ];
        for (let i = 0; i < count; i++) {
            const item = ItemInstance.drop(arrGetOne(candidates), 35, 1000);
            this.anyaGoods.push(item);
        }

        return this.anyaGoods;
    }
}

const userData = new UserData();
export default userData;