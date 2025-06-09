import { ItemById } from "../config/Item";
import { UnitById } from "../config/Unit";
import Const from "../Const";
import ItemInstance from "../data/ItemInstance";
import ReactStat from "../data/ReactStat";
import userData from "../data/UserData";
import { dispatch } from "../EventBus";
import { arrCombinations, objEntries } from "../Utils";
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
        this.stat.update(this.persistantData);
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
     * @param {boolean} [dontUpdateStat=false]
     */
    tryUnquip(item, dontUpdateStat) {
        const itemConfig = ItemById[item.id];
        const equipped = this.persistantData.inventory[Const.ITEM_TYPE_SLOT[itemConfig.type]];
        const index = equipped.findIndex(e => e.uuid === item.uuid);
        if (index === -1) {
            dispatch("toast", "物品未装备");
            console.error("Item not equipped:", item);
            return false; // Item not equipped
        }

        // Remove the item from the equipped slot
        equipped.splice(index, 1);
        if (!dontUpdateStat) {
            this.stat.update(this.persistantData);
        }
        this.persistantData.bag.push(item); // Add it back to the bag
        dispatch("bag:refresh", null);
        dispatch("inventory:refresh", null);
        userData.saveToDisk();
        return true; // Successfully unequipped
    }

    /**
     * 
     * @param {ItemSaveData} item 
     */
    tryEquipItemFromBag(item) {
        const indexInBag = this.persistantData.bag.findIndex(e => e.uuid === item.uuid);
        if (indexInBag === -1) {
            dispatch("toast", "物品不在背包中");
            console.error("Item not found in bag:", item);
            return false; // Item not found in bag
        }

        const itemConfig = ItemById[item.id];
        const slotType = Const.ITEM_TYPE_SLOT[itemConfig.type];
        let equipped = this.persistantData.inventory[slotType];
        if (equipped == null) {
            // Initialize the slot if it doesn't exist
            equipped = [];
            this.persistantData.inventory[slotType] = equipped;
        }
        let unequipped = false;

        if (slotType === "arms") {
            // 1. must equip current
            const combinations = arrCombinations(equipped);

            for (const combination of combinations) {
                combination.push(item);
            }
            const policies = Const.EQUIP_POLICY[this.config.id];

            /**@type {ItemSaveData[][]} */
            let successes = [];
            for (const combination of combinations) {
                for (const policy of policies) {
                    if (policy.length !== combination.length) {
                        continue; // Skip if the policy length doesn't match the combination length
                    }
                    // compare each item in the combination with the policy
                    let match = true;
                    for (let i = 0; match && i < policy.length; i++) {
                        if (policy[i] !== Const.ITEM_SUBTYPE[ItemById[combination[i].id].type]) {
                            match = false;
                        }
                    }
                    if (match) {
                        successes.push(combination);
                        break; // No need to check further policies
                    }
                }
            }
            if (successes.length === 0) {
                dispatch("toast", "无法装备此武器");
                return false; // No valid combination found
            }
            successes.sort((a, b) => b.length - a.length);
            for (let i = equipped.length - 1; i >= 0; i--) {
                const e = equipped[i];
                if (!successes[0].includes(e)) {
                    // unequip last item in slot
                    const result = this.tryUnquip(e, true);
                    unequipped = result || unequipped;
                }
            }
        } else {
            for (let i = equipped.length - 1; i >= 0; i--) {
                const currentSize = equipped.reduce((acc, cur) => acc + Const.ITEM_TYPE_SIZE[ItemById[cur.id].type], 0);
                if (currentSize + Const.ITEM_TYPE_SIZE[itemConfig.type] > Const.SLOT_MAX_SIZE[slotType]) {
                    // unequip last item in slot
                    const result = this.tryUnquip(equipped[i], true);
                    unequipped = result || unequipped;
                } else {
                    break;
                }
            }
        }

        if (unequipped) {
            dispatch("toast", "已替换装备");
        }

        // Add the item to the equipped slot
        equipped.push(item);
        this.stat.update(this.persistantData);
        this.persistantData.bag.splice(indexInBag, 1); // Remove it from the bag
        dispatch("bag:refresh", null);
        dispatch("inventory:refresh", null);
        userData.saveToDisk();
    }

    getSocketFillers() {
        const fillers = [];
        for (const item of this.persistantData.bag) {
            const itemConfig = ItemById[item.id];
            if (itemConfig.type === "rune") {
                fillers.push(item);
            }
        }
        return fillers;
    }

    /**
     * 
     * @param {string} uuid 
     * @returns {ItemSaveData}
     */
    findItemByUuid(uuid) {
        let item = this.persistantData.bag.find(e => e.uuid === uuid);
        if (item != null) {
            return item;
        }
        for (const [, items] of objEntries(this.persistantData.inventory)) {
            item = items.find(e => e.uuid === uuid);
            if (item != null) {
                return item;
            }
        }
        for (const item of this.persistantData.charmBag) {
            if (item.uuid === uuid) {
                return item;
            }
        }
        return null; // Item not found
    }

    /**
     * 
     * @param {ItemSaveData} svItem 
     * @param {ItemSaveData} socketItem 
     */
    trySocketItem(svItem, socketItem) {
        const item = this.findItemByUuid(svItem.uuid);
        const allSockets = ItemInstance.getSocketCount(item);
        const filledSockets = ItemInstance.getFilledSocketCount(item);
        if (filledSockets >= allSockets) {
            dispatch("toast", "插槽已满");
            return false; // All sockets are filled
        }

        for (let i = 0; i < allSockets; i++) {
            const k = i.toString();
            const v = item.sockets[k];
            if (v != null) {
                continue;
            }
            item.sockets[k] = socketItem;
            break;
        }
        const indexInBag = this.persistantData.bag.findIndex(e => e.uuid === socketItem.uuid);
        this.persistantData.bag.splice(indexInBag, 1); // Remove it from the bag
        ItemInstance.runeWordCarving(item);
        this.stat.update(this.persistantData);
        dispatch("bag:refresh", null);
        dispatch("inventory:refresh", null);
        userData.saveToDisk();
    }
}
