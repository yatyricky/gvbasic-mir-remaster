import Component from "./Component";

export default class Renderer extends Component {
    constructor() {
        super();
        this.queue = 0;
    }

    onInit() {
        super.onInit();

        // set queue inherit target
        let curr = this.gameObject.parent;
        while (curr != null) {
            const renderer = curr.getComponent(Renderer);
            if (renderer != null) {
                this.queue = renderer.queue;
                break;
            }
            curr = curr.parent;
        }
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

    /**
     * @param {Array<IRenderInstruction>} buffer
     */
    render(buffer) {
    }

    getInspector() {
        return `<strong>Renderer</strong><br/>
        <table>
            <tr>
                <td>Queue</td>
                <td>${this.queue}</td>
            </tr>
        </table>
        `
    }
}
