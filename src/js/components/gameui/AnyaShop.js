import Const from "../../Const";
import { subscribe } from "../../EventBus";
import GameObject from "../../gameObjs/GameObject";
import Component from "../Component";
import TextRenderer from "../TextRenderer";
import RectRenderer from "../RectRenderer";
import Renderer from "../Renderer";
import UIFocus from "../UIFocus";

export default class AnyaShop extends Component {
    onInit() {
        this.menu = new GameObject("menu", this.gameObject);
        this.menu.addComponent(Renderer).setQueue(Const.QUEUE_UI);
        this.focus = this.menu.addComponent(UIFocus).setInput(this.focusOnInput.bind(this));
        this.menu.setActive(false);
        /**@type {string[]} */
        this.path = [];

        this.tradeType = new GameObject("tradeType", this.menu);
        this.backdrop = new GameObject("backdrop", this.tradeType).setPosition(0.5, 0.5);
        this.backdrop.addComponent(RectRenderer).setBgColor(Const.COLOR_BG).setBorder(Const.COLOR_FG, 1).setSize(9, 4);

        this.buyButton = new GameObject("buy", this.tradeType).setPosition(4, 1).setSize(2, 1);
        this.buyButton.addComponent(TextRenderer).setText("购买");
        this.focus.focusable.push(this.buyButton);

        this.sellButton = new GameObject("sell", this.tradeType).setPosition(4, 2).setSize(2, 1);
        this.sellButton.addComponent(TextRenderer).setText("出售");
        this.focus.focusable.push(this.sellButton);

        this.focus.focus = this.buyButton;

        subscribe("shop:anya", this.open.bind(this));
    }

    open() {
        this.path.push("/");
        this.updateUI();
    }

    /**
     * @param {string} key
     */
    focusOnInput(key) {
        if (key === "b") {
            this.path.pop();
            this.updateUI();
        }
    }

    updateUI() {
        if (this.path.length <= 0) {
            this.menu.setActive(false);
            return;
        }
        if (this.path.length === 1) {
            this.tradeType.setActive(true);
            this.menu.setActive(true);
        } else {
            
        }
    }
}
