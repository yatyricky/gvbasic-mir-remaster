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
export function mathRandomIncl(from, to) {
    return mathLerp(from, to, mathRandom01Incl());
}
