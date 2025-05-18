import { UnitById } from "../configData/Unit";
import ReactStat from "../data/ReactStat";
import Component from "./Component";

export default class UnitComponent extends Component {
    constructor() {
        super();
    }

    /**
     * 
     * @param {IUnit} persistantData 
     */
    initData(persistantData) {
        this.config = UnitById[persistantData.unitId];
        this.stat = new ReactStat(persistantData.stats);
        return this;
    }
}
