export default class KeyEvent {
    /**
     * 
     * @param {string} key 
     */
    constructor(key) {
        this.key = key;
        this._used = false;
    }

    use() {
        this._used = true;
    }

    get used() {
        return this._used;
    }
}
