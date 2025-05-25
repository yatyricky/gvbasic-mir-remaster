/**
 * 
 * @param {number} a 
 * @param {number} b 
 * @param {number} t 0f-1f
 * @returns 
 */
export function mathLerp(a, b, t) {
    return a + (b - a) * t;
}

export function mathRandom01Incl() {
    return Math.floor(Math.random() * 10001) / 10000;
}

/**
 * 
 * @param {number} from 
 * @param {number} to 
 * @returns 
 */
export function mathRandomInt(from, to) {
    return Math.floor(Math.random() * (to - from)) + from;
}

/**
 * 
 * @param {number} from 
 * @param {number} to 
 * @returns 
 */
export function mathRandomIncl(from, to) {
    return mathLerp(from, to, mathRandom01Incl());
}

/**
 * 
 * @param {number[]} weights
 */
export function mathWeightedRandom(weights) {
    const total = weights.reduce((a, b) => a + b, 0);
    const random = Math.random() * total;
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
        sum += weights[i];
        if (random <= sum) {
            return i;
        }
    }
    return -1;
}

/**
 * 
 * @param {number} value 
 * @param {number} fluctuation 
 * @returns 
 */
export function mathFluctuate(value, fluctuation) {
    const f = value * fluctuation;
    return mathRandomIncl(value - f, value + f);
}
