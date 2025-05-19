import Component from "./Component";

export default class Renderer extends Component {
    constructor() {
        super();
        this.queue = 0;
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
}
