import { ItemById } from "../../config/Item";
import SceneManager from "../../SceneManager";
import GameObject from "../../gameObjs/GameObject";
import Component from "../Component";
import UIFocus from "../UIFocus";
import UnitComponent from "../UnitComponent";
import TextRenderer from "../TextRenderer";
import Const from "../../Const";
import Rect from "../../data/Rect";
import Button from "../Button";
import { dispatch, subscribe } from "../../EventBus";
import ItemComponent from "../ItemComponent";

export default class BagPanel extends Component {
    onInit() {
        this.container = new GameObject("container", this.gameObject);
        this.container.setPosition(0, 0).setSize(10, 4);
        this.uiFocus = this.gameObject.addComponent(UIFocus).setTarget(this.container).setDisableKeyB(true);

        this.refreshBag();

        subscribe("bag:refresh", () => {
            this.refreshBag();
        });
    }

    refreshBag() {
        this.container.clearChildren();
        const hero = SceneManager.activeScene.find("game/hero").getComponent(UnitComponent);
        let c = 0;
        for (const item of hero.persistantData.bag) {
            const itemConfig = ItemById[item.id];
            const obj = new GameObject(item.id, this.container).setSize(1, 1);
            obj.setPosition(c % 10, Math.floor(c / 10));
            obj.addComponent(TextRenderer)
                .setText(itemConfig.image)
                .setBgColor(Const.QUALITY_COLOR[item.quality])
                .setViewport(new Rect(0, 1, 10, 4));
            obj.addComponent(Button).setOnClick(() => {
                dispatch("inspect:item", {
                    item, actionX: () => {
                        hero.tryEquipItemFromBag(item);
                        dispatch("inspect:item", null);
                    }
                });
            });
            obj.addComponent(ItemComponent).setItem(item);
            c++;
        }

        this.uiFocus.setTarget(this.container);
    }
}