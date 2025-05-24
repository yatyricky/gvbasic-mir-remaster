import { UnitById } from "../config/Unit";
import ReactStat from "../data/ReactStat";
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
        this.config = UnitById[persistantData.unitId];
        this.stat = new ReactStat(persistantData.stats);
        return this;
    }

    getItem() {
        /**@type {ItemInstance} */
        const x = null;
    }
}
