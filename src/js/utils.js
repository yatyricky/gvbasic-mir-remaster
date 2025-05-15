let c = 1;

export function uuid() {
    return c++;
}

export async function waitForSeconds(seconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });
}
