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
import { dispatch } from "../../EventBus";
import MessageBox from "../MessageBox";
// import { arrRemove } from "../../Utils";
import ItemComponent from "../ItemComponent";

export default class BagPanel extends Component {
    onInit() {
        this.container = new GameObject("container", this.gameObject);
        this.container.setPosition(0, 0).setSize(10, 4);
        this.uiFocus = this.gameObject.addComponent(UIFocus).setTarget(this.container);

        this.refreshBag();
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
                                    // arrRemove(this.goods, item);
                                    this.refreshBag();
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
    }
}