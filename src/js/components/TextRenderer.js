import Config from "../Config";
import { strIsEmpty } from "../Utils";
import Renderer from "./Renderer";

export default class TextRenderer extends Renderer {
    constructor() {
        super();
        this.text = "";
        this.width = 0;
        this.bgColor = null;
        this.color = null;
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

        const gox = Math.round(this.gameObject.x * 2);
        const goy = this.gameObject.y;
        // Set text properties
        /**@type {Partial<IFillTextArgs>} */
        const textArgs = {
            font: `${Math.round(Config.SIZE2 * 0.75)}px 'Courier New', Courier, monospace`,
            textBaseline: "middle",
            textAlign: "center",
            fillStyle: "",
        }

        // Set colors
        if (strIsEmpty(this.color)) {
            textArgs.fillStyle = Config.COLOR_FG;
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

            // Draw background if specified
            if (!strIsEmpty(this.bgColor)) {
                buffer.push({
                    queue: this.queue,
                    type: "fillRect",
                    args: {
                        fillStyle: this.bgColor,
                        x: (x + gox) * Config.SIZE,
                        y: (y + goy) * Config.SIZE2,
                        w: w * Config.SIZE,
                        h: Config.SIZE2
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
                    x: (x + gox) * Config.SIZE + (w * Config.SIZE / 2),
                    y: (y + goy) * Config.SIZE2 + (Config.SIZE2 / 2)
                }
            })

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
