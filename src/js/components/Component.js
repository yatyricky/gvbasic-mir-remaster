import KeyEvent from "../KeyEvent";

export default class Component {
    constructor() {
        this.gameObject = null;
    }

    onInit() {
    }

    /**
     * 
     * @param {KeyEvent} key 
     */
    onInput(key) {

    }

    toString() {
        return this.constructor.name;
    }
}
