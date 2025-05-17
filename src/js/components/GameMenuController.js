import Config from "../Config";
import GameObject from "../gameObjs/GameObject";
import Component from "./Component";
import TextRenderer from "./TextRenderer";

export default class GameMenuController extends Component {
    /**
     * 
     * @param {string} key 
     */
    onInput(key) {
        super.onInput(key);
        if (key === "b") {
            this.menu.setActive(!this.menu.active);
        }
    }

    onInit() {
        this.menu = new GameObject("menu", this.gameObject);
        this.menu.addComponent(TextRenderer).setText("Game Menu").setBgColor('rgba(0, 0, 0, 1)').setColor("rgba(66,35,77,1)").setQueue(Config.QUEUE_UI);
        this.menu.setActive(false);
    }
}