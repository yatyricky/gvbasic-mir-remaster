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
import { strWrap } from "../../Utils";

export default class InventoryPanel extends Component {
    onInit() {
        this.container = new GameObject("container", this.gameObject);
        this.container.setPosition(0, 0).setSize(10, 4);
        this.uiFocus = this.gameObject.addComponent(UIFocus).setTarget(this.container).setDisableKeyB(true);

        this.refreshInventory();

        subscribe("inventory:refresh", () => {
            this.refreshInventory();
        });
    }

    refreshInventory() {
        this.container.clearChildren();
        const hero = SceneManager.activeScene.find("game/hero").getComponent(UnitComponent);
        let c = 0;
        for (const slot of Const.SLOT_SORT) {
            let equipped = hero.persistantData.inventory[slot];
            if (equipped == null) {
                equipped = [];
                hero.persistantData.inventory[slot] = equipped;
            }
            /**@type {Array<{status: "empty"|"equipped"|"occupied", item: ItemSaveData}>} */
            const arrangement = [];
            for (let i = 0; i < Const.SLOT_MAX_SIZE[slot]; i++) {
                arrangement.push({ status: "empty", item: null });
            }

            let j = 0;
            for (const equip of equipped) {
                const itemConfig = ItemById[equip.id];
                if (itemConfig == null) {
                    console.warn("Unknown item in inventory:", equip);
                    continue;
                }
                arrangement[j] = { status: "equipped", item: equip };
                for (let k = 1; k < itemConfig.size; k++) {
                    if (j + k < arrangement.length) {
                        arrangement[j + k] = { status: "occupied", item: equip };
                    } else {
                        console.warn("Item size exceeds slot capacity:", itemConfig, "at index", j + k);
                    }
                }
                j += itemConfig.size;
            }

            for (let i = 0; i < arrangement.length; i++) {
                const e = arrangement[i];
                let sb = `${Const.SLOT_NAME[slot]}${Const.SLOT_MAX_SIZE[slot] > 1 ? i + 1 : ""}:`;
                if (e.status === "empty") {
                    sb += "未装备";
                } else if (e.status === "equipped") {
                    sb += `${e.item.name}`;
                } else if (e.status === "occupied") {
                    sb += "占用";
                }
                const wrapped = strWrap(sb).split("\n");
                const obj = new GameObject(`${slot}_${i}`, this.container).setSize(10, wrapped.length).setPosition(0, c);
                obj.addComponent(TextRenderer)
                    .setText(wrapped.join("\n"))
                    .setBgColor(Const.QUALITY_COLOR[e.item ? e.item.quality : 0])
                    .setViewport(new Rect(0, 1, 10, 4));
                const btn = obj.addComponent(Button);
                if (e.status === "empty") {
                    btn.setOnClick(() => {
                        dispatch("toast", "该栏位未装备任何物品");
                    });
                } else if (e.status === "equipped") {
                    btn.setOnClick(() => {
                        dispatch("inspect:item", {
                            item: e.item,
                            actionX: () => {
                                hero.tryUnquip(e.item);
                                dispatch("inspect:item", null);
                            }
                        });
                    });
                } else if (e.status === "occupied") {
                    btn.setOnClick(() => {
                        dispatch("toast", "该槽位已被占用");
                    });
                }

                c += wrapped.length;
            }
        }

        this.container.setPosition(0, 0);
        this.uiFocus.setTarget(this.container);
    }
}