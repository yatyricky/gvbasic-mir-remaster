import Const from "./Const";
import { mathWeightedRandom } from "./data/MathLab";
import Range from "./data/Range";

let c = 1;

export function uuid() {
    return c++;
}

/**
 * 
 * @param {number} val 
 * @returns 
 */
export function sign(val) {
    return val > 0 ? 1 : (val < 0 ? -1 : 0);
}

/**
 * 
 * @param {number} value 
 * @param {number} precision 
 * @returns 
 */
export function numFloor(value, precision = 0) {
    if (value == null) {
        return 0;
    }
    if (precision < 0) {
        throw new Error("Precision must be a non-negative integer.");
    }
    const factor = Math.pow(10, precision);
    return Math.floor(value * factor) / factor;
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
 * @param {number[]} weights 
 * @param {number} count 
 * @returns {Array<T>}
 */
export function arrGetSomeWeighted(arr, weights, count) {
    if (arrIsEmpty(arr)) {
        return [];
    }

    if (arr.length === 1) {
        return [arr[0]];
    }

    if (weights == null || weights.length !== arr.length) {
        throw new Error("Weights must be an array of the same length as the input array.");
    }

    if (weights.some(w => w <= 0)) {
        throw new Error("Weights must be non-negative.");
    }

    count = Math.min(count, arr.length);
    const _arr = [...arr];
    const _weights = [...weights];

    const result = [];
    for (let i = 0; i < count; i++) {
        const idx = mathWeightedRandom(_weights);
        result.push(_arr[idx]);
        _arr.splice(idx, 1);
        _weights.splice(idx, 1);
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
 * @template T
 * @param {T[]} arr 
 * @returns {Array<Array<T>>}
 */
export function arrCombinations(arr) {
    /**@type {T[][]} */
    const result = [[]];
    /**
     * 
     * @param {T[]} prefix 
     * @param {number} start 
     */
    const f = (prefix, start) => {
        for (let i = start; i < arr.length; i++) {
            result.push([...prefix, arr[i]]);
            f([...prefix, arr[i]], i + 1);
        }
    };
    f([], 0);
    return result;
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
 * @param {any} val 
 * @param {number} pts 
 * @returns {string}
 */
function _strFormatter(val, pts) {
    if (typeof val === "number") {
        return numFloor(val, pts).toFixed(pts);
    } else if (typeof val === "object") {
        if (val == null) {
            return "NULL";
        }
        if (Array.isArray(val)) {
            const resp = val.map(v => _strFormatter(v, pts)).filter(v => !strIsEmpty(v) && v !== "无").join("、");
            if (strIsEmpty(resp)) {
                return "无";
            } else {
                return resp;
            }
        }
        if (val.value != null) {
            return numFloor(val.value, pts).toFixed(pts);
        }
        if (val.range != null) {
            if (Range.isZero(val.range)) {
                return "无";
            }
            if (val.dmgType != null) {
                return `<span style="color: ${Const.SKILL_TAG_COLOR[/**@type {SkillTag}*/(val.dmgType)]} ;">${numFloor(val.range[0], pts).toFixed(pts)}-${numFloor(val.range[1], pts).toFixed(pts)}${Const.SKILL_TAG_NAME[/**@type {SkillTag}*/(val.dmgType)]}</span>`;
            } else {
                return `${numFloor(val.range[0], pts).toFixed(pts)}-${numFloor(val.range[1], pts).toFixed(pts)}`;
            }
        }
        return JSON.stringify(val);
    } else {
        return val;
    }
}

/**
 * 
 * @param {string} str 
 * @param  {...any} args 
 * @returns 
 */
export function strFormat(str, ...args) {
    const regex = /{(?<idx>\d+)(\.(?<pts>\d+))?}/g;
    return str.replace(regex, (_0, _1, _2, _3, _4, _5, groups) => {
        const idx = parseInt(groups?.idx);
        const pts = parseInt(groups?.pts ?? "0");
        const val = args[idx];
        return _strFormatter(val, pts);
    });
}

/**
 * 
 * @param {object} obj 
 * @returns 
 */
export function objIsEmpty(obj) {
    return obj == null || Object.keys(obj).length === 0;
}

/**
 * @template {string} K
 * @template T
 * @param {Partial<Record<K, T>>} obj 
 * @returns {Array<[K, T]>}
 */
export function objEntries(obj) {
    if (objIsEmpty(obj)) {
        return [];
    }
    return /**@type {any}*/(Object.entries(obj));
}

/**
 * @template {string} K
 * @template T
 * @param {Partial<Record<K, T>>} obj 
 * @returns {Array<K>}
 */
export function objKeys(obj) {
    if (objIsEmpty(obj)) {
        return [];
    }
    return /**@type {any}*/(Object.keys(obj));
}

/**
 * Get debug info for a function - returns file name and line number
 * @param {Function} func - The function to get debug info for
 * @returns {string} - String containing file name and line number
 */
export function getFunctionDebugInfo(func) {
    if (typeof func !== 'function') {
        return 'Not a function';
    }

    // Method 1: Use function toString() and try to find it in stack trace
    try {
        // Create an error to get current stack trace
        const error = new Error();
        const stack = error.stack;

        if (stack) {
            const lines = stack.split('\n');

            // Look for the function name in the stack
            if (func.name) {
                for (const line of lines) {
                    if (line.includes(func.name)) {
                        const match = line.match(/(.+?):(\d+):(\d+)/);
                        if (match) {
                            const fileName = match[1].split('/').pop() || match[1].split('\\').pop();
                            return `${fileName}:${match[2]} (${func.name})`;
                        }
                    }
                }
            }

            // Fallback: try to match any relevant file info
            for (let i = 1; i < Math.min(lines.length, 4); i++) {
                const line = lines[i];
                const match = line.match(/at (.+?) \((.+?):(\d+):(\d+)\)/);
                if (match) {
                    const fileName = match[2].split('/').pop() || match[2].split('\\').pop();
                    // Skip if it's this debug file
                    if (!fileName.includes('DebugStat')) {
                        return `${fileName}:${match[3]} (context)`;
                    }
                }
            }
        }
    } catch (e) {
        // Continue to fallback
    }

    // Method 2: Analyze function properties
    const funcInfo = [];

    if (func.name) {
        funcInfo.push(`function: ${func.name}`);
    } else {
        funcInfo.push('anonymous function');
    }

    funcInfo.push(`params: ${func.length}`);

    // Try to determine function type from source
    const source = func.toString();
    if (source.includes('function')) {
        funcInfo.push('type: function declaration');
    } else if (source.includes('=>')) {
        funcInfo.push('type: arrow function');
    } else if (source.includes('class')) {
        funcInfo.push('type: class method');
    }

    return funcInfo.join(', ');
}

/**
 * Enhanced version that tries to get more context about where the function is called from
 * @param {Function} func - The function to analyze
 * @returns {string} - Debug information with call context
 */
export function getContextualFunctionInfo(func) {
    const basicInfo = getFunctionDebugInfo(func);

    // Get current call location
    const stack = new Error().stack;
    if (stack) {
        const lines = stack.split('\n');
        // Skip the first few lines (Error constructor, this function)
        for (let i = 2; i < Math.min(lines.length, 5); i++) {
            const line = lines[i];
            const match = line.match(/at (.+?) \((.+?):(\d+):(\d+)\)/);
            if (match) {
                const fileName = match[2].split('/').pop() || match[2].split('\\').pop();
                return `${basicInfo} | called from: ${fileName}:${match[3]}`;
            }
        }
    }

    return basicInfo;
}
