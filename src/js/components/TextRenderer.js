export default class TextRenderer {
    constructor() {
        this.text = "";
        this.width = 0;
        this.queue = 0;
    }

    setText(text) {
        this.text = text;
        return this;
    }

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
        };
    }
}
