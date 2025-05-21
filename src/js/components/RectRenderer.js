import Const from "../Const";
import Renderer from "./Renderer";

export default class RectRenderer extends Renderer {
    constructor() {
        super();
        this.w = 0;
        this.h = 0;
        this.bgColor = null;
        this.borderColor = null;
        this.borderWidth = 0;
    }

    /**
     * 
     * @param {string} color 
     * @returns 
     */
    setBgColor(color) {
        this.bgColor = color;
        return this;
    }

    /**
     * 
     * @param {string} color 
     * @param {number} borderWidth 
     */
    setBorder(color, borderWidth) {
        this.borderColor = color;
        this.borderWidth = borderWidth;
        return this;
    }

    /**
     * 
     * @param {number} w 
     * @param {number} h 
     * @returns 
     */
    setSize(w, h) {
        this.w = w;
        this.h = h;
        return this;
    }

    /**
     * @override
     * @param {Array<IRenderInstruction>} buffer 
     */
    render(buffer) {
        if (this.bgColor == null && (this.borderColor == null || this.borderWidth <= 0)) {
            return;
        }
        if (this.w <= 0 || this.h <= 0) {
            return;
        }

        const w = Math.round(this.w * Const.SIZE2);
        const h = Math.round(this.h * Const.SIZE2);
        const x = Math.round(this.gameObject.x * Const.SIZE2 - w / 2);
        const y = Math.round(this.gameObject.y * Const.SIZE2 - h / 2);

        if (this.bgColor != null) {
            buffer.push({
                queue: this.queue,
                type: "fillRect",
                args: { fillStyle: this.bgColor, x, y, w, h }
            });
        }

        if (this.borderColor != null && this.borderWidth > 0) {
            buffer.push({
                queue: this.queue,
                type: "strokeRect",
                args: { strokeStyle: this.borderColor, lineWidth: this.borderWidth, x, y, w, h }
            })
        }
    }

    getInspector() {
        return "[inherit]" + super.getInspector() + `<strong>RectRenderer</strong><br/>
        <table>
            <tr>
                <td>bgColor</td>
                <td><span style="color:${this.bgColor}">■</span>${this.bgColor}</td>
            </tr>
            <tr>
                <td>borderColor</td>
                <td><span style="color:${this.borderColor}">■</span>${this.borderColor}</td>
            </tr>
            <tr>
                <td>borderWidth</td>
                <td>${this.borderWidth}</td>
            </tr>
            <tr>
                <td>size</td>
                <td>(${this.w}, ${this.h})</td>
            </tr>
        </table>
        `;
    }
}