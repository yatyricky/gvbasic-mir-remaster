import Component from "./Component";

export default class Button extends Component {
    onClick() {
        this.callback?.();
    }

    /**
     * 
     * @param {() => void} callback 
     * @returns 
     */
    setOnClick(callback) {
        this.callback = callback;
        return this;
    }
}
