import Config from "../Config";
import { dispatch } from "../EventBus";
import GameObject from "../gameObjs/GameObject";
import Button from "./Button";
import Component from "./Component";
import TextRenderer from "./TextRenderer";

export default class GameMenuController extends Component {
    /**
     * 
     * @param {string} key 
     */
    onInput(key) {
        super.onInput(key);
        switch (key) {
            case "y":
                this.toggleMenu();
                break;
            case "l":
                this.updateActiveTab(-1);
                break;
            case "r":
                this.updateActiveTab(1);
                break;
            case "a":
                this.tabList[this.activeTab].getComponent(Button).onClick();
                break;
            default:
                break;
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
            this.toggleMenu();
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

    toggleMenu() {
        this.menu.setActive(!this.menu.active);
        dispatch("game:menu", this.menu.active);
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
