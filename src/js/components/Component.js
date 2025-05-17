export default class Component {
    constructor() {
        this.gameObject = null;
    }

    onInit() {
    }

    /**
     * 
     * @param {string} key 
     */
    onInput(key) {

    }

    toString() {
        return this.constructor.name;
    }
}
