export default class GameObject {
    /**
     * 
     * @param {string} text 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(text, x, y) {
        this.x = x ?? 0;
        this.y = y ?? 0;
        this.text = text;
        this.width = 0;
        this._updateWidth();
    }

    _updateWidth() {
        let s = 0;
        for (const c of this.text) {
            s += c.charCodeAt(0) > 255 ? 2 : 1;
        }
        this.width = s;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    setText(text) {
        this.text = text;
        this._updateWidth();
    }

    onInput(key) {

    }
}
