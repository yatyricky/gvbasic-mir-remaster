import Config from "../Config";
import TextRenderer from "../components/TextRenderer";
import { flushEvents } from "../EventBus";
import GameObject from "./GameObject";

const app = document.getElementById('app');
app.style.fontSize = `${Math.round(Config.SIZE2 * 0.75)}px`;
app.style.width = `${Config.SIZE * 20}px`;
app.style.height = `${Config.SIZE2 * 5}px`;

/**
 * 
 * @param {HTMLElement} dom 
 * @param {IPixel[]} pixels 
 */
function updateRender(dom, pixels) {
    let x = 0;
    let y = 0;

    let i = 0;
    for (const c of pixels) {
        if (c.text === '\n') {
            y++;
            x = 0;
            continue;
        }

        const w = c.text.charCodeAt(0) > 255 ? 2 : 1;
        if (x + w > 20) {
            y++;
            x = 0;
        }

        if (y >= 5) {
            break;
        }

        let td = /**@type {HTMLElement} */(dom.children[i]);
        if (td == null) {
            td = document.createElement('div');
            td.className = 'pixel';
            dom.appendChild(td);
        }
        td.textContent = c.text;
        td.style.width = `${w * Config.SIZE}px`;
        td.style.height = `${Config.SIZE2}px`;
        td.style.top = `${y * Config.SIZE2}px`;
        td.style.left = `${x * Config.SIZE}px`;
        td.style.lineHeight = `${Config.SIZE2}px`;
        if (c.bgColor != null) {
            td.style.backgroundColor = c.bgColor;
        } else {
            td.style.backgroundColor = '';
        }
        if (c.color != null) {
            td.style.color = c.color;
        } else {
            td.style.color = '';
        }
        if (td.style.display === 'none') {
            td.style.display = 'block';
        }

        i++;
        x += w;
    }
    while (i < dom.children.length) {
        const td = /**@type {HTMLElement} */(dom.children[i]);
        td.style.display = 'none';
        i++;
    }
}

/**
 * 
 * @param {GameObject} root 
 * @returns 
 */
function updateRecursive(root) {
    if (!root.active) {
        return;
    }
    root.update();
    for (const child of root.children) {
        updateRecursive(child);
    }
}

/**
 * 
 * @param {IPixel[]} a 
 * @param {IPixel[]} b 
 */
function comparePixels(a, b) {
    if (a == null && b == null) {
        return true;
    }
    if (a == null || b == null) {
        return false;
    }
    if (a.length === 0 && b.length === 0) {
        return true;
    }
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        const c1 = a[i];
        const c2 = b[i];
        if (c1.text !== c2.text) {
            return false;
        }
        const c1bgnull = c1.bgColor == null;
        const c2bgnull = c2.bgColor == null;
        if (c1bgnull !== c2bgnull) {
            return false;
        }
        if (!c1bgnull && c1.bgColor !== c2.bgColor) {
            return false;
        }
        const c1fgnull = c1.color == null;
        const c2fgnull = c2.color == null;
        if (c1fgnull !== c2fgnull) {
            return false;
        }
        if (!c1fgnull && c1.color !== c2.color) {
            return false;
        }
    }
    return true;
}

/**
 * 
 * @param {GameObject} root 
 * @param {Map<number, Array<IPixel>>} buffer 
 * @returns 
 */
function buildBufferRecursive(root, buffer) {
    if (!root.active) {
        return;
    }
    const renderer = root.getComponent?.(TextRenderer);
    if (renderer != null) {
        const { queue, pixels, bgColor, color } = renderer.render();
        if (!buffer.has(queue)) {
            buffer.set(queue, []);
        }
        const canvas = buffer.get(queue);
        for (const { x, y, text } of pixels) {
            const w = text.charCodeAt(0) > 255 ? 2 : 1;
            if (x + w > 20) {
                continue;
            }
            canvas[y * 20 + x] = { text, bgColor, color };
            if (w > 1) {
                canvas[y * 20 + x + 1] = null;
            }
        }
    }
    for (const child of root.children) {
        buildBufferRecursive(child, buffer);
    }
}

export default class Scene extends GameObject {
    /**@type {Array<IPixel[]>} */
    static _depthBuffer = [];

    /**
     * 
     * @param {string} name 
     */
    constructor(name) {
        super(name ?? "Scene", null, true);
        this._isRunning = false;
    }

    start() {
        this._isRunning = true;
        this._gameLooper = this.gameLoop.bind(this);
        requestAnimationFrame(this._gameLooper);
    }

    stop() {
        this._isRunning = false;
        this._gameLooper = null;
    }

    gameLoop() {
        // logic
        updateRecursive(this);
        // render
        // 1. build depth buffer
        /**@type {Map<number, Array<IPixel>>} */
        const buffer = new Map();
        buildBufferRecursive(this, buffer);

        // 2. sort buffer
        /**@type {Array<{ pixels: IPixel[], queue: number }>} */
        const pushBuffer = [];
        const keys = Array.from(buffer.keys());
        keys.sort((a, b) => a - b);
        for (const k of keys) {
            const canvas = buffer.get(k);
            /**@type {Array<IPixel>} */
            const sb = [];
            for (let i = 0; i < canvas.length; i++) {
                const c = canvas[i];
                if (c === undefined) {
                    sb.push({ text: ' ' });
                } else if (c === null) {
                    continue;
                } else {
                    sb.push(c);
                }
            }
            pushBuffer.push({ pixels: sb, queue: k });
        }

        // 2. compare with depth buffer and render
        let i = 0;
        for (; i < pushBuffer.length; i++) {
            const { pixels } = pushBuffer[i];
            const curr = Scene._depthBuffer[i];
            let dc = /**@type {HTMLElement}*/(app.children[i]);
            if (dc == null) {
                dc = document.createElement('div');
                dc.style.width = `${Config.SIZE * 20}px`;
                dc.style.height = `${Config.SIZE2 * 5}px`;
                dc.className = 'queue';
                app.appendChild(dc);
                updateRender(dc, pixels)
            } else if (!comparePixels(curr, pixels)) {
                updateRender(dc, pixels);
            }
            Scene._depthBuffer[i] = pixels;
            if (dc.style.display === 'none') {
                dc.style.display = 'block';
            }
        }
        for (; i < Scene._depthBuffer.length; i++) {
            Scene._depthBuffer[i] = null;
            /**@type {HTMLElement}*/(app.children[i]).style.display = 'none';
        }

        flushEvents();

        // 3. request next frame
        if (this._isRunning) {
            requestAnimationFrame(this._gameLooper);
        }
    }
}
