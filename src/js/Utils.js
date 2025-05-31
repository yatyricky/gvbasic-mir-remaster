let c = 1;

export function uuid() {
    return c++;
}

/**
 * 
 * @param {number} seconds 
 * @returns {Promise<void>}
 */
export async function waitForSeconds(seconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });
}

/**
 * @template T
 * @param {Array<T>} arr 
 * @returns 
 */
export function arrIsEmpty(arr) {
    return arr == null || !Array.isArray(arr) || arr.length === 0;
}

/**
 * @template T
 * @param {T[]} arr 
 * @returns {T}
 */
export function arrLast(arr) {
    if (arrIsEmpty(arr)) {
        return undefined;
    }
    return arr[arr.length - 1];
}

/**
 * @template T
 * @param {Array<T>} arr 
 * @param {number} index 
 * @returns {T}
 */
export function arrGetClamped(arr, index) {
    if (arrIsEmpty(arr)) {
        return undefined;
    }
    if (index < 0) {
        index = 0;
    }
    if (index >= arr.length) {
        index = arr.length - 1;
    }
    return arr[index];
}

/**
 * Gets a random subset of elements from an array without modifying the original array
 * Optimized for both small and large selection sizes
 * @template T
 * @param {Array<T>} arr - The array to sample from
 * @param {number} count - The number of elements to get
 * @returns {Array<T>} A new array containing random elements
 */
export function arrGetSome(arr, count) {
    if (arrIsEmpty(arr)) {
        return [];
    }

    count = Math.min(count, arr.length);

    const indexes = Array(arr.length);
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        indexes[i] = i;
    }
    const result = Array(count);
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * len);
        const index = indexes[randomIndex];
        result[i] = arr[index];
        len--;
        indexes[randomIndex] = indexes[len]; // Swap with the last element
    }

    return result;
}

/**
 * @template T
 * @param {T[]} arr 
 * @returns {T}
 */
export function arrGetOne(arr) {
    return arrGetSome(arr, 1)[0];
}

/**
 * @template {object} T
 * @param {T[]} arr 
 * @param {string} groupField 
 * @returns {Map<any, T[]>}
 */
export function arrGroupBy(arr, groupField) {
    const map = new Map();
    for (const item of arr) {
        const key = /**@type {any}*/(item)[groupField];
        if (!map.has(key)) {
            map.set(key, []);
        }
        map.get(key).push(item);
    }
    return map;
}

/**
 * @template T
 * @param {T[]} arr 
 * @param {T} item 
 */
export function arrRemove(arr, item) {
    const index = arr.indexOf(item);
    if (index > -1) {
        arr.splice(index, 1);
    }
}

/**
 * 
 * @param {string} text 
 * @returns {number} 0-20
 */
export function strWidth(text) {
    let s = 0;
    for (const c of text) {
        if (c === '\n') {
            continue;
        }
        s += c.charCodeAt(0) > 255 ? 2 : 1;
    }
    return s;
}

/**
 * 
 * @param {string} str 
 * @returns 
 */
export function strIsEmpty(str) {
    return str == null || str.length === 0 || Array(str).every((c) => c === ' ');
}

/**
 * 
 * @param {string} str 
 * @param {number} [width] 
 * @returns 
 */
export function strWrap(str, width) {
    width = width ?? 20
    const rows = [];
    let row = [];
    let s = 0;
    for (const c of str) {
        if (c === '\n') {
            rows.push(row.join(''));
            row = [];
            s = 0;
            continue;
        }
        const w = strWidth(c);
        if (s + w > width) {
            rows.push(row.join(''));
            row = [];
            s = 0;
        }
        row.push(c);
        s += w;
    }
    if (row.length > 0) {
        rows.push(row.join(''));
    }
    return rows.join('\n');
}

/**
 * 
 * @param {object} obj 
 * @returns 
 */
export function objIsEmpty(obj) {
    return obj == null || Object.keys(obj).length === 0;
}
