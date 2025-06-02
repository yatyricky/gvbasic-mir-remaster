import { mathRandomIncl } from "../../data/MathLab";
import Const from "../../Const";
import GameObject from "../../gameObjs/GameObject";
import Component from "../Component";
import RectRenderer from "../RectRenderer";
import TextRenderer from "../TextRenderer";
import UIFocus from "../UIFocus";
import ItemInstance from "../../data/ItemInstance";
import { arrGetOne, arrRemove } from "../../Utils";
import { ItemById } from "../../config/Item";
import Button from "../Button";
import Rect from "../../data/Rect";
import ItemComponent from "../ItemComponent";
import { dispatch } from "../../EventBus";
import MessageBox from "../MessageBox";
import SceneManager from "../../SceneManager";
import UnitComponent from "../UnitComponent";

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

        this.uiFocus = this.gameObject.addComponent(UIFocus).setTarget(this.container);
        this.refreshGoods = true;
        /**@type {ItemSaveData[]} */
        this.goods = [];
    }

    onEnable() {
        // if (!this.refreshGoods) {
        //     return;
        // }

        this.refreshGoods = false;
        this.container.setPosition(0, 1);

        const count = mathRandomIncl(20, 40);
        this.goods = [];
        /**@type {ItemId[]} */
        const candidates = ["clotharmor", "leatherarmor", "grandcharm", "largecharm", "smallcharm", "commonnecklace", "commonring"];
        for (let i = 0; i < count; i++) {
            const item = ItemInstance.drop(arrGetOne(candidates), 35, 1000);
            this.goods.push(item);
        }

        this.updateGoodsDisplay();
    }

    /**
     * @override
     * @param {number} dt 
     */
    update(dt) {
    }

    updateGoodsDisplay() {
        this.container.clearChildren();
        let c = 0;
        for (const item of this.goods) {
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
                        dispatch("panel:show", () => {
                            const panel = new GameObject("MessageBox");
                            const msgBox = panel.addComponent(MessageBox);
                            msgBox.setTitle("购买物品").setContent(`你确定要购买"${item.name}"吗?`);
                            msgBox.setActions([{
                                text: "确定",
                                action: () => {
                                    const hero = SceneManager.activeScene.find("game/hero");
                                    const heroComponent = hero.getComponent(UnitComponent);
                                    // if (heroComponent.stat.getStat("gold") < itemConfig.price) {
                                    //     dispatch("panel:show", () => {
                                    //         const errorPanel = new GameObject("MessageBox");
                                    //         errorPanel.addComponent(MessageBox).setTitle("错误").setContent("金币不足，无法购买。");
                                    //     });
                                    //     return;
                                    // }
                                    // heroComponent.stat.addStat("gold", -itemConfig.price);
                                    heroComponent.addBagItem(item);
                                    msgBox.close();
                                    arrRemove(this.goods, item);
                                    this.updateGoodsDisplay();
                                    dispatch("toast", `购买成功，获得物品: ${item.name}`);
                                    dispatch("inspect:item", null);
                                }
                            }, {
                                text: "取消",
                                action: () => {
                                    msgBox.close();
                                }
                            }])
                            return panel;
                        })
                    }
                });
            });
            obj.addComponent(ItemComponent).setItem(item);
            c++;
        }

        this.uiFocus.setTarget(this.container);
    }
}
