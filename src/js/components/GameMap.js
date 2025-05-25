import { UnitById } from "../config/Unit";
import Const from "../Const";
import { dispatch } from "../EventBus";
import GameObject from "../gameObjs/GameObject";
import Collider from "./Collider";
import Component from "./Component";
import TextRenderer from "./TextRenderer";

export default class GameMap extends Component {
    onInit() {
        super.onInit();
        this.town = new GameObject("town", this.gameObject);

        this.anya = new GameObject("anya", this.town);
        this.anya.setPosition(8, 1);
        this.anya.addComponent(Collider).setLayer(Const.LAYER_NPC).setCallback(this.onAnya.bind(this));
        const anyaConfig = UnitById.anya;
        this.anya.addComponent(TextRenderer).setText(anyaConfig.image).setQueue(Const.QUEUE_NPC);

        this.wallRange(0, 0, 9, 0, "🌲", this.town);
        this.wallRange(0, 1, 0, 3, "🌲", this.town);
        this.wallRange(0, 4, 4, 4, "🪵", this.town);
        this.wallRange(9, 1, 9, 3, "🌲", this.town);
        this.wallRange(6, 4, 9, 4, "🪵", this.town);
        this.wallRange(1, 3, 1, 3, "🪨", this.town);

        const exit = new GameObject("exit", this.town).setPosition(5, 5);
        exit.addComponent(Collider).setLayer(Const.LAYER_NPC).setCallback(this.onExit.bind(this));
    }

    /**
     * 
     * @param {number} x1 
     * @param {number} y1 
     * @param {number} x2 
     * @param {number} y2 
     * @param {string} image 
     * @param {GameObject} parent
     */
    wallRange(x1, y1, x2, y2, image, parent) {
        for (let x = x1; x <= x2; x++) {
            for (let y = y1; y <= y2; y++) {
                const wall = new GameObject("wall", this.town).setPosition(x, y);
                wall.addComponent(Collider).setLayer(Const.LAYER_WALL);
                wall.addComponent(TextRenderer).setText(image).setQueue(Const.QUEUE_PROPS);
            }
        }
    }

    onAnya() {
        dispatch("shop:anya", null);
    }

    onExit() {
        console.log("Exit clicked");
        // dispatch("scene:login");
    }
}
