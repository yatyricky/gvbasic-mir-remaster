let c = 1;

export function uuid() {
    return c++;
}

export async function waitForSeconds(seconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });
}

export function arrIsEmpty(arr) {
    return arr == null || arr.length === 0;
}

export function arrLast(arr) {
    if (arrIsEmpty(arr)) {
        return undefined;
    }
    return arr[arr.length - 1];
}

export function strWidth(text) {
    let s = 0;
    for (const c of text) {
        s += c.charCodeAt(0) > 255 ? 2 : 1;
    }
    return s;
}

export function strIsEmpty(str) {
    return str == null || str.length === 0 || Array(str).every((c) => c === ' ');
}

export function strWrap(str, width) {
    width = width ?? 20
    const rows = [];
    let row = [];
    let s = 0;
    for (const c of str) {
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
