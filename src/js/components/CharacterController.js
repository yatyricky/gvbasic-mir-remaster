import KeyEvent from "../KeyEvent";
import Component from "./Component";

export default class CharacterController extends Component {
    constructor() {
        super();
    }

    /**
     * @override 
     * @param {KeyEvent} key
     */
    onInput(key) {
        // if (key === "a") {
        //     this.gameObject.getComponent("TextRenderer").setText(shuffleString(randomText));
        // }

        if (key.key === "u") {
            this.gameObject.y = Math.max(this.gameObject.y - 1, 0);
        }

        if (key.key === "d") {
            this.gameObject.y = Math.min(this.gameObject.y + 1, 4);
        }

        if (key.key === "l") {
            this.gameObject.x = Math.max(this.gameObject.x - 1, 0);
        }

        if (key.key === "r") {
            this.gameObject.x = Math.min(this.gameObject.x + 1, 9);
        }
    }
}
