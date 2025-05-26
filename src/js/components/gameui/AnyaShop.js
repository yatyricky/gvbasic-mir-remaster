import Const from "../../Const";
import { subscribe } from "../../EventBus";
import GameObject from "../../gameObjs/GameObject";
import Component from "../Component";
import TextRenderer from "../TextRenderer";
import RectRenderer from "../RectRenderer";
import Renderer from "../Renderer";
import Button from "../Button";
import AnyaBuyPanel from "./AnyaBuyPanel";
import UIFocus from "../UIFocus";

export default class AnyaShop extends Component {
    onInit() {
        this.menu = new GameObject("menu", this.gameObject);
        this.menu.addComponent(Renderer).setQueue(Const.QUEUE_UI);
        this.menu.setActive(false);

        this.tradeType = new GameObject("tradeType", this.menu);
        this.backdrop = new GameObject("backdrop", this.tradeType).setPosition(0.5, 0.5);
        this.backdrop.addComponent(RectRenderer).setBgColor(Const.COLOR_BG).setBorder(Const.COLOR_FG, 1).setSize(9, 4);

        this.buyButton = new GameObject("buy", this.tradeType).setPosition(4, 1).setSize(2, 1);
        this.buyButton.addComponent(TextRenderer).setText("购买");
        this.buyButton.addComponent(Button).setOnClick(() => {
            this.buyPanel.setActive(true);
        });

        this.sellButton = new GameObject("sell", this.tradeType).setPosition(4, 2).setSize(2, 1);
        this.sellButton.addComponent(TextRenderer).setText("出售");
        this.sellButton.addComponent(Button);

        this.tradeType.addComponent(UIFocus);

        this.buyPanel = new GameObject("buyPanel", this.menu);
        this.buyPanel.addComponent(AnyaBuyPanel);
        this.buyPanel.setActive(false);

        subscribe("shop:anya", () => {
            this.tradeType.setActive(true);
            this.menu.setActive(true);
        });
    }

    /**
     * @param {string} key
     */
    focusOnInput(key) {
        if (key === "b") {
            this.menu.setActive(false);
        }
    }
}
