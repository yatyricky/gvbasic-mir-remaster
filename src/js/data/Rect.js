export default class Rect {
    /**
     * 
     * @param {number} [x] 
     * @param {number} [y] 
     * @param {number} [w] 
     * @param {number} [h] 
     */
    constructor(x, y, w, h) {
        this.x = x ?? 0;
        this.y = y ?? 0;
        this.w = w ?? 0;
        this.h = h ?? 0;
    }

    /**
     * 
     * @param {Rect} other 
     * @returns 
     */
    overlaps(other) {
        return this.x < other.x + other.w &&
            this.x + this.w > other.x &&
            this.y < other.y + other.h &&
            this.y + this.h > other.y;
    }

    /**
     * 
     * @param {Rect} other 
     * @returns 
     */
    contains(other) {
        return this.x <= other.x &&
            this.x + this.w >= other.x + other.w &&
            this.y <= other.y &&
            this.y + this.h >= other.y + other.h;
    }

    toString() {
        return `Rect(${this.x}, ${this.y}, ${this.w}, ${this.h})`;
    }
}
