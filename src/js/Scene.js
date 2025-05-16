import Config from "./Config";
import TextRenderer from "./TextRenderer";

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

    console.log("rerender");
    
}

export default class Scene {
    /**@type {Scene} */
    static activeScene = null;
    static setActiveScene(scene) {
        Scene.activeScene = scene;
    }

    static _depthBuffer = [];

    constructor() {
        this.gameObjects = [];
        this._isRunning = false;
        this.start();
    }

    addGameObject(gameObject) {
        this.gameObjects.push(gameObject);
    }

    getGameObjects() {
        return this.gameObjects;
    }

    start() {
        this._isRunning = true;
        this._updater = this.update.bind(this);
        requestAnimationFrame(this._updater);
    }

    update() {
        // logic
        for (const go of this.gameObjects) {
            go.update?.();
        }
        // render
        // 1. build depth buffer
        const buffer = new Map();
        for (const go of this.gameObjects) {
            const renderer = go.getComponent(TextRenderer);
            if (renderer) {
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
        }

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
            pushBuffer.push(sb.join(''));
        }

        // 2. compare with depth buffer and render
        let i = 0;
        for (; i < pushBuffer.length; i++) {
            const str = pushBuffer[i];
            const curr = Scene._depthBuffer[i];
            if (curr == null) {
                Scene._depthBuffer[i] = str;
                const dc = document.createElement('div');
                dc.className = 'queue';
                app.appendChild(dc);
                updateRender(dc, str)
            } else if (curr !== str) {
                Scene._depthBuffer[i] = str;
                updateRender(app.children[i], str);
            }
            if (app.children[i].style.display === 'none') {
                app.children[i].style.display = 'block';
            }
        }
        for (; i < Scene._depthBuffer.length; i++) {
            Scene._depthBuffer[i] = null;
            app.children[i].style.display = 'none';
        }

        // 3. request next frame
        if (this._isRunning) {
            requestAnimationFrame(this._updater);
        }
    }
}
