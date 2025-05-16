import Config from "../Config";
import TextRenderer from "../components/TextRenderer";
import { flushEvents } from "../eventBus";
import { strIsEmpty } from "../utils";
import Hierarchy from "./Hierarchy";

const app = document.getElementById('app');
app.style.fontSize = `${Math.round(Config.SIZE2 * 0.75)}px`;
app.style.width = `${Config.SIZE * 20}px`;
app.style.height = `${Config.SIZE2 * 5}px`;

function updateRender(dom, text) {
    let x = 0;
    let y = 0;

    let i = 0;
    for (const c of text) {
        if (c === '\n') {
            y++;
            x = 0;
            continue;
        }

        const w = c.charCodeAt(0) > 255 ? 2 : 1;
        if (x + w > 20) {
            y++;
            x = 0;
        }

        if (y >= 5) {
            break;
        }

        let td = dom.children[i];
        if (td == null) {
            td = document.createElement('div');
            td.className = 'pixel';
            dom.appendChild(td);
        }
        td.textContent = c;
        td.style.width = `${w * Config.SIZE}px`;
        td.style.height = `${Config.SIZE2}px`;
        td.style.top = `${y * Config.SIZE2}px`;
        td.style.left = `${x * Config.SIZE}px`;
        td.style.lineHeight = `${Config.SIZE2}px`;
        if (td.style.display === 'none') {
            td.style.display = 'block';
        }

        i++;
        x += w;
    }
    while (i < dom.children.length) {
        const td = dom.children[i];
        td.style.display = 'none';
        i++;
    }
}

function updateRecursive(root) {
    if (!root.active) {
        return;
    }
    root.update?.();
    for (const child of root.children) {
        updateRecursive(child);
    }
}

function buildBufferRecursive(root, buffer) {
    if (!root.active) {
        return;
    }
    const renderer = root.getComponent?.(TextRenderer);
    if (renderer != null) {
        const { queue, pixels } = renderer.render();
        if (!buffer.has(queue)) {
            buffer.set(queue, []);
        }
        const canvas = buffer.get(queue);
        for (const { x, y, text } of pixels) {
            const w = text.charCodeAt(0) > 255 ? 2 : 1;
            if (x + w > 20) {
                continue;
            }
            canvas[y * 20 + x] = text;
            if (w > 1) {
                canvas[y * 20 + x + 1] = null;
            }
        }
    }
    for (const child of root.children) {
        buildBufferRecursive(child, buffer);
    }
}

export default class Scene extends Hierarchy {
    /**@type {Scene} */
    static activeScene = null;
    static setActiveScene(scene) {
        Scene.activeScene?.stop();
        Scene.activeScene = scene;
        scene.start();
    }

    static _depthBuffer = [];

    constructor() {
        super();
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
        const buffer = new Map();
        buildBufferRecursive(this, buffer)

        // 2. sort buffer
        const pushBuffer = [];
        const keys = Array.from(buffer.keys());
        keys.sort((a, b) => a - b);
        for (const k of keys) {
            const canvas = buffer.get(k);
            const sb = [];
            for (let i = 0; i < canvas.length; i++) {
                const c = canvas[i];
                if (c === undefined) {
                    sb.push(' ');
                } else if (c === null) {
                    continue;
                } else {
                    sb.push(c);
                }
            }
            pushBuffer.push({ str: sb.join(''), queue: k });
        }

        // 2. compare with depth buffer and render
        let i = 0;
        for (; i < pushBuffer.length; i++) {
            const { str, queue } = pushBuffer[i];
            const curr = Scene._depthBuffer[i];
            let dc = app.children[i];
            if (dc == null) {
                dc = document.createElement('div');
                dc.style.width = `${Config.SIZE * 20}px`;
                dc.style.height = `${Config.SIZE2 * 5}px`;
                dc.className = 'queue';
                app.appendChild(dc);
                updateRender(dc, str)
            } else if (curr !== str) {
                updateRender(dc, str);
            }
            Scene._depthBuffer[i] = str;
            if (app.children[i].style.display === 'none') {
                app.children[i].style.display = 'block';
            }
            if (queue === Config.QUEUE_MODAL && !strIsEmpty(str)) {
                dc.style.backgroundColor = 'rgba(51, 112, 72, 0.8)';
            } else {
                dc.style.backgroundColor = 'rgba(255, 255, 255, 0)';
            }
        }
        for (; i < Scene._depthBuffer.length; i++) {
            Scene._depthBuffer[i] = null;
            app.children[i].style.display = 'none';
        }

        flushEvents();

        // 3. request next frame
        if (this._isRunning) {
            requestAnimationFrame(this._gameLooper);
        }
    }
}
