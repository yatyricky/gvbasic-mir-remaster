import { ItemById } from "../config/Item";
import { UnitById } from "../config/Unit";
import Const from "../Const";
import ReactStat from "../data/ReactStat";
import userData from "../data/UserData";
import { dispatch } from "../EventBus";
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
        dispatch("bag:refresh", null);
        userData.saveToDisk();
    }

    /**
     * 
     * @param {ItemSaveData} item 
     */
    tryUnquip(item) {
        const itemConfig = ItemById[item.id];
        const equipped = this.persistantData.inventory[itemConfig.slot];
        const index = equipped.findIndex(e => e === item);
        if (index === -1) {
            dispatch("toast", "物品未装备");
            console.error("Item not equipped:", item);
            return false; // Item not equipped
        }

        // Remove the item from the equipped slot
        equipped.splice(index, 1);
        this.persistantData.bag.push(item); // Add it back to the bag
        dispatch("bag:refresh", null);
        userData.saveToDisk();
        return true; // Successfully unequipped
    }

    /**
     * 
     * @param {ItemSaveData} item 
     */
    tryEquipItemFromBag(item) {
        const indexInBag = this.persistantData.bag.findIndex(e => e === item);
        if (indexInBag === -1) {
            dispatch("toast", "物品不在背包中");
            console.error("Item not found in bag:", item);
            return false; // Item not found in bag
        }

        const itemConfig = ItemById[item.id];
        let equipped = this.persistantData.inventory[itemConfig.slot];
        if (equipped == null) {
            // Initialize the slot if it doesn't exist
            equipped = [];
            this.persistantData.inventory[itemConfig.slot] = equipped;
        }
        for (let i = equipped.length - 1; i >= 0; i--) {
            const currentSize = equipped.reduce((acc, cur) => acc + ItemById[cur.id].size, 0);
            if (currentSize + itemConfig.size > Const.SLOT_MAX_SIZE[itemConfig.slot]) {
                // unequip last item in slot
                this.tryUnquip(equipped[i]);
            } else {
                break;
            }
        }

        // Add the item to the equipped slot
        equipped.push(item);
        this.persistantData.bag.splice(indexInBag, 1); // Remove it from the bag
        dispatch("bag:refresh", null);
        userData.saveToDisk();
    }
}
