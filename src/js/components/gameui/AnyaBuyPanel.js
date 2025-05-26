import { mathRandomIncl } from "../../data/MathLab";
import Const from "../../Const";
import GameObject from "../../gameObjs/GameObject";
import Component from "../Component";
import RectRenderer from "../RectRenderer";
import TextRenderer from "../TextRenderer";
import UIFocus from "../UIFocus";
import ItemInstance from "../../data/ItemInstance";
import { arrGetOne } from "../../Utils";
import { ItemById } from "../../config/Item";
import Button from "../Button";
import Rect from "../../data/Rect";
import ItemComponent from "../ItemComponent";
import { dispatch } from "../../EventBus";

export default class AnyaBuyPanel extends Component {
    onInit() {
        const backDrop = new GameObject("backdrop", this.gameObject);
        backDrop.addComponent(RectRenderer).setBgColor(Const.COLOR_BG).setSize(10, 5);
        const titleObj = new GameObject("title", this.gameObject);
        titleObj.addComponent(RectRenderer).setBgColor(Const.COLOR_BG_04).setSize(10, 1);
        const title = new GameObject("titleText", titleObj);
        title.addComponent(TextRenderer).setText("安雅-购买").setBgColor(Const.COLOR_BG_04);

        this.container = new GameObject("container", this.gameObject);
        this.container.setPosition(0, 1).setSize(10, 4);

        this.gameObject.addComponent(UIFocus).setTarget(this.container);
        this.refreshGoods = true;
        /**@type {ItemSaveData[]} */
        this.goods = [];
    }

    onEnable() {
        // if (!this.refreshGoods) {
        //     return;
        // }

        this.refreshGoods = false;

        const count = mathRandomIncl(25, 65);
        this.goods = [];
        /**@type {ItemId[]} */
        const candidates = ["ebonywoodsword", "sandalnecklace", "whitetigernecklace", "dodgenecklace"];
        for (let i = 0; i < count; i++) {
            const item = ItemInstance.drop(arrGetOne(candidates), 15, 50);
            this.goods.push(item);
        }

        this.container.clearChildren();
        let c = 0;
        for (const item of this.goods) {
            const itemConfig = ItemById[item.id];
            const obj = new GameObject(item.id, this.container);
            obj.setPosition(c % 10, Math.floor(c / 10));
            obj.addComponent(TextRenderer)
                .setText(itemConfig.image)
                .setBgColor(Const.QUALITY_COLOR[item.quality])
                .setViewport(new Rect(0, 1, 10, 4));
            obj.addComponent(Button).setOnClick(() => {
                dispatch("inspect:item", item);
            });
            obj.addComponent(ItemComponent).setItem(item);
            c++;
        }
    }

    /**
     * @override
     * @param {number} dt 
     */
    update(dt) {
    }
}
