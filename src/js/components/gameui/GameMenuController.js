import Const from "../../Const";
import { dispatch } from "../../EventBus";
import GameObject from "../../gameObjs/GameObject";
import KeyEvent from "../../KeyEvent";
import Button from "../Button";
import Component from "../Component";
import StatPanel from "./StatPanel";
import TextRenderer from "../TextRenderer";
import InventoryPanel from "./InventoryPanel";
import SkillPanel from "./SkillPanel";
import BagPanel from "./BagPanel";
import RectRenderer from "../RectRenderer";

export default class GameMenuController extends Component {
    /**
     * 
     * @param {KeyEvent} e 
     */
    onInput(e) {
        if (this.menu.active) {
            e.use();
            switch (e.key) {
                case "a":
                    this.tabList[this.activeTab].getComponent(Button)?.onClick();
                    break;
                case "b":
                    this.toggleMenu(false);
                    break;
                case "y":
                    this.updateActiveTab(1);
                    break;
                default:
                    break;
            }
        } else if (e.key === "y") {
            this.toggleMenu(true);
        }
    }

    onInit() {
        this.menu = new GameObject("menu", this.gameObject);
        this.menu.setActive(false);
        this.activeTab = 0;
        this.tabs = new GameObject("tabs", this.menu);
        this.panels = new GameObject("panels", this.menu).setPosition(0, 1);
        this.panels.addComponent(RectRenderer).setBgColor(Const.COLOR_BG).setSize(10, 4).setQueue(Const.QUEUE_UI);

        this.addStatTab();
        this.addInventoryTab();
        this.addBagTab();
        this.addSkillsTab();

        this.tabExit = new GameObject("exit", this.tabs).setPosition(8, 0);
        this.tabExit.addComponent(TextRenderer).setText("退出").setBgColor(Const.COLOR_BG_04).setQueue(Const.QUEUE_UI);
        this.tabExit.addComponent(Button).setOnClick(() => {
            this.toggleMenu(false);
            this.updateActiveTab(1);
            dispatch("scene:menu", null);
        });

        this.tabList = [
            this.tabStat,
            this.tabInventory,
            this.tabBag,
            this.tabSkills,
            this.tabExit
        ];
        this.panelList = [
            this.panelStat,
            this.panelInventory,
            this.panelBag,
            this.panelSkill
        ]
        this.updateActiveTab();
    }

    /**
     * 
     * @param {boolean} [flag]
     */
    toggleMenu(flag) {
        if (flag === undefined) {
            flag = !this.menu.active;
        }
        this.menu.setActive(flag);
    }

    updateActiveTab(offset = 0) {
        this.activeTab = (this.activeTab + offset + this.tabList.length) % this.tabList.length;
        for (let i = 0; i < this.tabList.length; i++) {
            const tab = this.tabList[i];
            const tr = tab.getComponent(TextRenderer);
            if (i === this.activeTab) {
                tr.setBgColor(Const.COLOR_FG);
                tr.setColor(Const.COLOR_BG);
            } else {
                tr.setBgColor(Const.COLOR_BG_04);
                tr.setColor(Const.COLOR_FG);
            }

            const panel = this.panelList[i];
            if (panel == null) {
                continue;
            }
            if (i === this.activeTab) {
                panel.setActive(true);
            } else {
                panel.setActive(false);
            }
        }
    }

    addStatTab() {
        this.tabStat = new GameObject("stat", this.tabs);
        this.tabStat.addComponent(TextRenderer).setText("状态").setBgColor(Const.COLOR_BG_04).setQueue(Const.QUEUE_UI);

        this.panelStat = new GameObject("stat", this.panels);
        this.panelStat.addComponent(StatPanel);
    }

    addInventoryTab() {
        this.tabInventory = new GameObject("inventory", this.tabs).setPosition(2, 0);
        this.tabInventory.addComponent(TextRenderer).setText("装备").setBgColor(Const.COLOR_BG_04).setQueue(Const.QUEUE_UI);

        this.panelInventory = new GameObject("inventory", this.panels);
        this.panelInventory.addComponent(InventoryPanel);
    }

    addSkillsTab() {
        this.tabSkills = new GameObject("skills", this.tabs).setPosition(6, 0);
        this.tabSkills.addComponent(TextRenderer).setText("技能").setBgColor(Const.COLOR_BG_04).setQueue(Const.QUEUE_UI);

        this.panelSkill = new GameObject("skill", this.panels);
        this.panelSkill.addComponent(SkillPanel);
    }

    addBagTab() {
        this.tabBag = new GameObject("bag", this.tabs).setPosition(4, 0);
        this.tabBag.addComponent(TextRenderer).setText("背包").setBgColor(Const.COLOR_BG_04).setQueue(Const.QUEUE_UI);
        this.panelBag = new GameObject("bag", this.panels);
        this.panelBag.addComponent(BagPanel);
    }
}
