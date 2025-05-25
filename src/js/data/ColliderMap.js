export default class ColliderMap {
    constructor() {
        /**@type {Array<import("../components/Collider").default>} */
        this.map = [];
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    has(x, y) {
        return this.get(x, y) != null;
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    get(x, y) {
        return this.map[y * 10 + x];
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {import("../components/Collider").default} collider 
     */
    set(x, y, collider) {
        this.map[y * 10 + x] = collider;
    }

    clear() {
        this.map = [];
    }
}
