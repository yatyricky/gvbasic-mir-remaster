export default class Range {
    /**
     * 
     * @param {number} min 
     * @param {number} max 
     */
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }

    toString() {
        return `${this.min}-${this.max}`;
    }

    isZero() {
        return this.min === 0 && this.max === 0;
    }
}