import { flushEvents } from "../EventBus";
import GameObject from "./GameObject";
import SceneManager from "../SceneManager";
import Renderer from "../components/Renderer";

const app = /**@type {HTMLCanvasElement}*/(document.getElementById('app'));
const ctx = app.getContext('2d');

/**
 * 
 * @param {GameObject} root 
 * @param {number} dt
 * @returns 
 */
function updateRecursive(root, dt) {
    if (!root.active) {
        return;
    }
    root.update(dt);
    for (const comp of root.getComponents()) {
        comp.update(dt);
    }
    for (const child of root.children) {
        updateRecursive(child, dt);
    }
}

/**
 * 
 * @param {GameObject} root 
 * @param {Array<IRenderInstruction>} buffer 
 * @returns 
 */
function buildBufferRecursive(root, buffer) {
    if (!root.active) {
        return;
    }
    const renderer = root.getComponent(Renderer);
    if (renderer != null) {
        renderer.render(buffer);
    }
    for (const child of root.children) {
        buildBufferRecursive(child, buffer);
    }
}

export default class Scene extends GameObject {
    /**@type {Array<IRenderInstruction[]>} */
    static _depthBuffer = [];

    /**
     * 
     * @param {string} name 
     */
    constructor(name) {
        super(name ?? "Scene", null, true);
        this._isRunning = false;
        this.prevTime = 0;
        this.deltaTime = 0;
        this.time = 0;
    }

    start() {
        this._isRunning = true;
        this._gameLooper = this.gameLoop.bind(this);
        this.prevTime = Date.now();
        requestAnimationFrame(this._gameLooper);
    }

    stop() {
        this._isRunning = false;
        this._gameLooper = null;
    }

    gameLoop() {
        this.time = Date.now();
        this.deltaTime = (this.time - this.prevTime) / 1000;
        // logic
        SceneManager.colliderMap.clear();
        updateRecursive(this, this.deltaTime);
        // render
        // 1. build depth buffer
        /**@type {Array<IRenderInstruction>} */
        const buffer = [];
        buildBufferRecursive(this, buffer);

        // 2. sort buffer
        /**@type {Array<{ pixels: IRenderInstruction[], queue: number }>} */
        buffer.sort((a, b) => {
            if (a.queue === b.queue) {
                return 0;
            }
            return a.queue < b.queue ? -1 : 1;
        });

        // 2. render
        ctx.clearRect(0, 0, app.width, app.height);

        let fillStyle = ctx.fillStyle;
        let strokeStyle = ctx.strokeStyle;
        let lineWidth = ctx.lineWidth;
        let font = ctx.font;
        let textBaseline = ctx.textBaseline;
        let textAlign = ctx.textAlign;

        for (const instruction of buffer) {
            if (instruction.type === "fillRect") {
                const args = /**@type {IFillRectArgs} */ (instruction.args);
                if (fillStyle !== args.fillStyle) {
                    fillStyle = args.fillStyle;
                    ctx.fillStyle = fillStyle;
                }
                ctx.fillRect(args.x, args.y, args.w, args.h);
                continue;
            }

            if (instruction.type === "fillText") {
                const args = /**@type {IFillTextArgs} */ (instruction.args);
                if (font !== args.font) {
                    font = args.font;
                    ctx.font = font;
                }
                if (textBaseline !== args.textBaseline) {
                    textBaseline = args.textBaseline;
                    ctx.textBaseline = textBaseline;
                }
                if (textAlign !== args.textAlign) {
                    textAlign = args.textAlign;
                    ctx.textAlign = textAlign;
                }
                if (fillStyle !== args.fillStyle) {
                    fillStyle = args.fillStyle;
                    ctx.fillStyle = fillStyle;
                }
                ctx.fillText(args.text, args.x, args.y);
                continue;
            }

            if (instruction.type === "strokeRect") {
                const args = /**@type {IStrokeRectArgs} */ (instruction.args);
                if (strokeStyle !== args.strokeStyle) {
                    strokeStyle = args.strokeStyle;
                    ctx.strokeStyle = strokeStyle;
                }
                if (lineWidth !== args.lineWidth) {
                    lineWidth = args.lineWidth;
                    ctx.lineWidth = lineWidth;
                }
                ctx.strokeRect(args.x, args.y, args.w, args.h);
                continue;
            }
        }

        flushEvents();

        // 3. request next frame
        if (this._isRunning) {
            this.prevTime = this.time;
            requestAnimationFrame(this._gameLooper);
        }
    }
}
