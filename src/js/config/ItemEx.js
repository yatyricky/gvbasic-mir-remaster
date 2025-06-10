import { Items } from "./Item";

export const ItemGroupBySetStat = Items.reduce(
    /**
     * 
     * @param {Partial<Record<StatId, IItemConfig[]>>} acc 
     * @param {IItemConfig} e 
     * @returns 
     */
    (acc, e) => {
        if (e.setStat != null && e.type !== "set") {
            /**@type {StatId[]} */
            let arr = [];
            if (!Array.isArray(e.setStat)) {
                arr.push(e.setStat);
            } else {
                arr = e.setStat;
            }
            arr.forEach(group => {
                if (!acc[group]) {
                    acc[group] = [];
                }
                acc[group].push(e);
            })
        }
        return acc;
    },
    {}
)

export const ItemSetGroupBySetStat = Items.reduce(
    /**
     * 
     * @param {Partial<Record<StatId, IItemConfig[]>>} acc 
     * @param {IItemConfig} e 
     * @returns 
     */
    (acc, e) => {
        if (e.setStat != null && e.type === "set") {
            /**@type {StatId[]} */
            let arr = [];
            if (!Array.isArray(e.setStat)) {
                arr.push(e.setStat);
            } else {
                arr = e.setStat;
            }
            arr.forEach(group => {
                if (!acc[group]) {
                    acc[group] = [];
                }
                acc[group].push(e);
            })
        }
        return acc;
    },
    {}
)
