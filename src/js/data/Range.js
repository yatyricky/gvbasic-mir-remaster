export default class Range {
    /**
     * 
     * @param {[number, number]} tuple 
     * @returns 
     */
    static isZero(tuple) {
        return tuple == null || (tuple[0] === 0 && tuple[1] === 0);
    }

    /**
     * 
     * @param {[number, number]} tuple 
     * @param {number} multiplier 
     * @returns {[number, number]}
     */
    static multSelf(tuple, multiplier) {
        tuple[0] *= multiplier;
        tuple[1] *= multiplier;
        return tuple;
    }

    /**
     * 
     * @param {[number, number]} tuple 
     * @param {number} multiplier 
     * @returns {[number, number]}
     */
    static mult(tuple, multiplier) {
        const res = /**@type {[number, number]}*/([...tuple]);
        return Range.multSelf(res, multiplier);
    }

    /**
     * 
     * @param {[number, number]} tuple 
     * @param {number} num 
     * @returns {[number, number]}
     */
    static addNumSelf(tuple, num) {
        tuple[0] += num;
        tuple[1] += num;
        return tuple;
    }

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

    /**
     * 
     * @param { [number, number] } tuple 
     * @returns 
     */
    static t(tuple) {
        return new Range(tuple[0], tuple[1]);
    }

    /**
     * 
     * @returns {[number, number]}
     */
    tup() {
        return [this.min, this.max];
    }
    
    /**
     * 
     * @param {number} num 
     * @returns 
     */
    addN(num) {
        this.min += num;
        this.max += num;
        return this;
    }

    /**
     * 
     * @param {Range} range 
     * @returns 
     */
    addR(range) {
        this.min += range.min;
        this.max += range.max;
        return this;
    }

    /**
     * 
     * @param {number} num 
     * @returns 
     */
    multN(num) {
        this.min *= num;
        this.max *= num;
        return this;
    }


}
