import { UnitById } from "../config/Unit";
import ReactStat from "../data/ReactStat";
import userData from "../data/UserData";
import Component from "./Component";

export default class UnitComponent extends Component {
    constructor() {
        super();
    }

    /**
     * 
     * @param {UnitSaveData} persistantData 
     */
    initData(persistantData) {
        this.persistantData = persistantData;
        this.config = UnitById[persistantData.unitId];
        this.stat = new ReactStat(persistantData.stats);
        return this;
    }

    getItem() {
    }

    /**
     * 
     * @param {ItemSaveData} item 
     */
    addBagItem(item) {
        this.persistantData.bag.push(item);
        userData.saveToDisk();
    }
}
