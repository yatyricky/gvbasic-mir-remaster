import Const from "../Const";
import { flushEvents } from "../EventBus";
import GameObject from "./GameObject";
import SceneManager from "../SceneManager";
import userData from "../data/UserData";
import UnitComponent from "../components/UnitComponent";
import { Stats } from "../config/Stat";
import Renderer from "../components/Renderer";

const app = /**@type {HTMLCanvasElement}*/(document.getElementById('app'));
app.style.width = `${Const.SIZE * 20}px`;
app.style.height = `${Const.SIZE2 * 5}px`;
app.width = Const.SIZE * 20;
app.height = Const.SIZE2 * 5;
const ctx = app.getContext('2d');

const domHierarchyTree = document.getElementById('hierarchyTree');
const domWatch = document.getElementById('watch');
const domWatchStat = document.getElementById('stat');
const domInspector = document.getElementById('inspector');

let prevTree = "";
const inspectTarget = new Map();
let inspectorTarget = 0;
/**
 * 
 * @param {number} i 
 */
// @ts-ignore
window.setTarget = function (i) {
    inspectorTarget = i;
}

function buildHierarchyTreeText() {
    let sb = ""
    let indent = 0;
    let id = 1;
    /**
     * 
     * @param {GameObject} curr 
     */
    function buildTreeRecursive(curr) {
        if (curr == null) {
            return;
        }
        let label = curr.name;
        const comps = [];
        for (const comp of curr.getComponents()) {
            comps.push(comp.toString());
        }
        if (comps.length > 0) {
            label += ` (${comps.join(', ')})`;
        }
        inspectTarget.set(id, curr);
        sb += `<div
                onclick="window.setTarget(${id})"
                style="${curr.active ? "" : "color:#4f4f4f;"} ${id === inspectorTarget ? "background-color: #999;" : ""}
                display:flex;"
                ><div style="width:${indent * 16}px;"></div>${label}</div>`;
        id++;
        for (const child of curr.children) {
            indent++;
            buildTreeRecursive(child);
            indent--;
        }
    }
    buildTreeRecursive(SceneManager.activeScene);
    return sb;
}

function buildHierarchyTree() {
    const latest = buildHierarchyTreeText();
    if (prevTree === latest) {
        return;
    }
    prevTree = latest;

    domHierarchyTree.innerHTML = latest;
}

let prevUserData = "";
function presentUserData() {
    const latest = JSON.stringify(userData.data, null, 2);
    if (prevUserData === latest) {
        return;
    }
    prevUserData = latest;

    domWatch.innerHTML = `<pre>${prevUserData}</pre>`;
}

let prevReactStat = "";
function watchReactStat() {
    let latest = "";
    const curr = SceneManager.activeScene.find("game/hero");
    if (curr != null) {
        const stat = curr.getComponent(UnitComponent).stat.data;
        let rows = [];
        for (const cfg of Stats) {
            if (cfg.type === "number") {
                rows.push(`${cfg.id}: ${stat[cfg.id]}`);
            } else if (cfg.type === "set") {
                rows.push(`${cfg.id}: [${Object.entries(stat[cfg.id]).map(e => `${e[0]}:${e[1]}`).join(', ')}]`);
            } else if (cfg.type === "range") {
                rows.push(`${cfg.id}: ${stat[cfg.id][0]}-${stat[cfg.id][1]}`);
            } else {
                rows.push(`${cfg.id}: ${stat[cfg.id]}`);
            }
        }
        // explode sb into arrays of array of 5
        const cols = 4;
        latest = "<table>";
        for (let i = 0; i < rows.length; i += cols) {
            latest += "<tr>";
            for (let j = 0; j < cols; j++) {
                latest += `<td>${rows[i + j] ?? ''}</td>`;
            }
            latest += "</tr>";
        }
        latest += "</table>";
    }

    if (prevReactStat === latest) {
        return;
    }
    prevReactStat = latest;
    domWatchStat.innerHTML = latest;
}

let prevInspector = "";
function updateInspector() {
    const target = inspectTarget.get(inspectorTarget);
    if (target == null) {
        return;
    }
    const latest = target.getInspector();
    if (prevInspector === latest) {
        return;
    }
    prevInspector = latest;
    domInspector.innerHTML = latest;
}

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

        // debug tree
        if (window.debug) {
            buildHierarchyTree();
            presentUserData();
            watchReactStat();
            updateInspector();
        }

        // 3. request next frame
        if (this._isRunning) {
            this.prevTime = this.time;
            requestAnimationFrame(this._gameLooper);
        }
    }
}
