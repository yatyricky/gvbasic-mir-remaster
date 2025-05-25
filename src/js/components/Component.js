import KeyEvent from "../KeyEvent";

export default class Component {
    constructor() {
        /**@type {import("../gameObjs/GameObject").default} */
        this.gameObject = null;
    }

    onInit() {
    }

    onEnable() {
    }

    onDisable() {
    }

    /**
     * 
     * @param {KeyEvent} key 
     */
    onInput(key) {

    }

    update() {
    }

    toString() {
        return this.constructor.name;
    }

    getInspector() {
        return "";
    }
}
