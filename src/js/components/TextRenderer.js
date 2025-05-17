import Component from "./Component";

export default class TextRenderer extends Component {
    constructor() {
        super();
        this.text = "";
        this.width = 0;
        this.queue = 0;
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
     * 
     * @param {number} queue 
     * @returns 
     */
    setQueue(queue) {
        this.queue = queue;
        return this;
    }

    render() {
        const pixels = [];
        let x = 0;
        let y = 0;
        const gox = Math.round(this.gameObject.x * 2);
        const goy = this.gameObject.y;
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

            pixels.push({ x: x + gox, y: y + goy, text: c });
            x += w;
        }
        return {
            queue: this.queue,
            pixels,
            bgColor: this.bgColor,
            color: this.color,
        };
    }
}
