import { StatById } from "../config/Stat";
import Component from "./Component";

export default class ItemComponent extends Component {
    constructor() {
        super();
        /**@type {ItemSaveData} */
        this.item = null; // Reference to the item this component is associated with
    }

    /**
     * @param {ItemSaveData} item
     */
    setItem(item) {
        this.item = item;
        return this;
    }

    getInspector() {
        let sb = "<strong>ItemComponent</strong>";
        if (this.item == null) {
            return sb + "<p>No item associated.</p>";
        } else {
            sb += `<table>
            <tr><td>id</td><td>${this.item.id}</td></tr>
            <tr><td>name</td><td>${this.item.name}</td></tr>
            <tr><td>ilvl</td><td>${this.item.ilvl}</td></tr>
            <tr><td>quality</td><td>${this.item.quality}</td></tr>
                   </table>
            Properties:
            <table>
            ${Object.entries(this.item.stats).map(([key, value]) => `<tr><td>${StatById[/**@type {StatId}*/(key)].name}</td><td>${Array.isArray(value) ? value.join(' - ') : value}</td></tr>`).join('')}
            </table>
                   `;
        }
        return sb;
    }
}
