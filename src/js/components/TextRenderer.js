import Const from "../Const";
import Rect from "../data/Rect";
import { strIsEmpty } from "../Utils";
import Renderer from "./Renderer";

export default class TextRenderer extends Renderer {
    constructor() {
        super();
        this.text = "";
        this.width = 0;
        this.bgColor = null;
        this.color = null;
        this.viewportRect = new Rect(0, 0, Const.SIZE2 * 10, Const.SIZE2 * 5); // Default viewport for 20x5 characters
    }

    /**
     * 
     * @param {string} text 
     * @returns 
     */
    setText(text) {
        this.text = text;
        return this;
    }

    /**
     * 
     * @param {Rect} viewport 
     */
    setViewport(viewport) {
        this.viewportRect = new Rect(viewport.x * Const.SIZE2, viewport.y * Const.SIZE2, viewport.w * Const.SIZE2, viewport.h * Const.SIZE2);
        return this;
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
     * @returns 
     */
    setColor(color) {
        this.color = color;
        return this;
    }

    /**
     * @override
     * @param {Array<IRenderInstruction>} buffer
     */
    render(buffer) {
        if (strIsEmpty(this.text)) {
            return;
        }

        const gox = Math.round(this.gameObject.gx * 2);
        const goy = this.gameObject.gy;
        // Set text properties
        /**@type {Partial<IFillTextArgs>} */
        const textArgs = {
            font: `${Math.round(Const.SIZE2 * 0.8)}px 'Courier New', Courier, monospace`,
            textBaseline: "middle",
            textAlign: "center",
            fillStyle: "",
        }

        // Set colors
        if (strIsEmpty(this.color)) {
            textArgs.fillStyle = Const.COLOR_FG;
        } else {
            textArgs.fillStyle = this.color;
        }

        // Process and render each character
        let x = 0;
        let y = 0;

        for (const c of this.text) {
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

            const charRect = new Rect((x + gox) * Const.SIZE, (y + goy) * Const.SIZE2, w * Const.SIZE, Const.SIZE2);
            if (this.viewportRect.contains(charRect)) {
                // Draw background if specified
                if (!strIsEmpty(this.bgColor)) {
                    buffer.push({
                        queue: this.queue,
                        type: "fillRect",
                        args: {
                            fillStyle: this.bgColor,
                            x: charRect.x,
                            y: charRect.y,
                            w: charRect.w,
                            h: charRect.h,
                        }
                    })
                }

                // Draw the character
                buffer.push({
                    queue: this.queue,
                    type: "fillText",
                    args: {
                        ...textArgs,
                        text: c,
                        x: charRect.x + (w * Const.SIZE / 2),
                        y: charRect.y + (Const.SIZE2 / 2)
                    }
                })
            }

            x += w;
        }
    }

    toString() {
        return `TextRenderer`
    }

    getInspector() {
        return "[inherit]" + super.getInspector() + `<strong>TextRenderer</strong>
        <table>
            <tr><td>text</td><td>${this.text.replaceAll("\n", "\\n")}</td></tr>
            <tr><td>width</td><td>${this.width}</td></tr>
            <tr><td>bgColor</td><td><span style="color:${this.bgColor}">■</span>${this.bgColor}</td></tr>
            <tr><td>color</td><td><span style="color:${this.color}">■</span>${this.color}</td></tr>
        </table>
        `
    }
}
