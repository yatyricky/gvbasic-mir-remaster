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
 * 
 * @param {string} text 
 * @returns 
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
