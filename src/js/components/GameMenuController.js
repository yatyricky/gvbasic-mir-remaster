import Config from "../Config";
import { dispatch } from "../EventBus";
import GameObject from "../gameObjs/GameObject";
import KeyEvent from "../KeyEvent";
import Button from "./Button";
import Component from "./Component";
import TextRenderer from "./TextRenderer";

export default class GameMenuController extends Component {
    /**
     * 
     * @param {KeyEvent} e 
     */
    onInput(e) {
        if (this.menu.active) {
            e.use();
            switch (e.key) {
                case "l":
                    this.updateActiveTab(-1);
                    break;
                case "r":
                    this.updateActiveTab(1);
                    break;
                case "a":
                    this.tabList[this.activeTab].getComponent(Button)?.onClick();
                    break;
                case "b":
                    this.toggleMenu(false);
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
        this.tabs = new GameObject("tabs", this.menu);
        this.activeTab = 0;

        this.tabStat = new GameObject("stat", this.tabs);
        this.tabStat.addComponent(TextRenderer).setText("状态").setBgColor(Config.COLOR_BG_04).setQueue(Config.QUEUE_UI);

        this.tabInventory = new GameObject("inventory", this.tabs).setPosition(2, 0);
        this.tabInventory.addComponent(TextRenderer).setText("装备").setBgColor(Config.COLOR_BG_04).setQueue(Config.QUEUE_UI);

        this.tabBag = new GameObject("bag", this.tabs).setPosition(4, 0);
        this.tabBag.addComponent(TextRenderer).setText("背包").setBgColor(Config.COLOR_BG_04).setQueue(Config.QUEUE_UI);

        this.tabSkills = new GameObject("skills", this.tabs).setPosition(6, 0);
        this.tabSkills.addComponent(TextRenderer).setText("技能").setBgColor(Config.COLOR_BG_04).setQueue(Config.QUEUE_UI);

        this.tabExit = new GameObject("exit", this.tabs).setPosition(8, 0);
        this.tabExit.addComponent(TextRenderer).setText("退出").setBgColor(Config.COLOR_BG_04).setQueue(Config.QUEUE_UI);
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
                tr.setBgColor(Config.COLOR_FG);
                tr.setColor(Config.COLOR_BG);
            } else {
                tr.setBgColor(Config.COLOR_BG_04);
                tr.setColor(Config.COLOR_FG);
            }
        }
    }
}
