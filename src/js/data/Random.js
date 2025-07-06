export default class Random {
    /**
     * 
     * @param {number} [seed] 
     */
    constructor(seed) {
        this.seed = seed ?? Math.floor(Math.random() * 1000000);
    }

    next() {
        // Use a simple linear congruential generator for demonstration purposes
        this.seed = (this.seed * 48271) % 2147483647;
        return this.seed / 2147483647; // Normalize to [0, 1)
    }

    nextIncl() {
        return Math.floor(this.next() * 100001) / 100000;
    }

    /**
     * 
     * @param {number} from 
     * @param {number} to 
     * @returns 
     */
    nextInt(from, to) {
        return Math.floor(this.next() * (to - from)) + from;
    }

    /**
     * 
     * @param {number} from 
     * @param {number} to 
     * @returns 
     */
    nextIntIncl(from, to) {
        return Math.floor(this.next() * (to - from + 1)) + from;
    }
}