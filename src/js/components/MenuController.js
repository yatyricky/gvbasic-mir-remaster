import userData from "../data/UserData";
import { dispatch } from "../EventBus";
import { arrLast } from "../Utils";
import Config from "../Config";
import GameObject from "../gameObjs/GameObject";
import TextRenderer from "./TextRenderer";
import { HeroIden } from "../configData/Hero";
import Component from "./Component";

export default class MenuController extends Component {
    onInit() {
        this.addMainMenu();
        this.addNewHeroMenu();
    }

    /**
     * 
     * @param {string} key 
     */
    onInput(key) {
        if (this.mainMenu.active) {
            if (key === 'u') {
                this.mainMenuArror.y = Math.max(1, this.mainMenuArror.y - 1);
            } else if (key === 'd') {
                this.mainMenuArror.y = Math.min(3, this.mainMenuArror.y + 1);
            } else if (key === 'a') {
                switch (this.mainMenuArror.y) {
                    case 1:
                        const last = arrLast(userData.data.chars);
                        if (last == null) {
                            dispatch("toast", "没有可使用的角色！");
                        } else {
                            dispatch("scene:game", null);
                        }
                        break;
                    case 2:
                        this.newHero();
                        break;
                    case 3:

                        break;

                    default:
                        break;
                }
            }
        } else if (this.newHeroMenu.active) {
            if (key === 'u') {
                this.newHeroArror.y = Math.max(1, this.newHeroArror.y - 1);
            } else if (key === 'd') {
                this.newHeroArror.y = Math.min(3, this.newHeroArror.y + 1);
            } else if (key === 'a') {
                switch (this.newHeroArror.y) {
                    case 1:
                        userData.addChar(HeroIden.warr);
                        break;
                    case 2:
                        userData.addChar(HeroIden.mage);
                        break;
                    case 3:
                        userData.addChar(HeroIden.wlk);
                        break;

                    default:
                        break;
                }
                dispatch("scene:game", null);
            } else if (key === 'b') {
                this.newHeroMenu.setActive(false);
                this.mainMenu.setActive(true);
            }
        }
    }

    addMainMenu() {
        this.mainMenu = new GameObject("mainMenu", this.gameObject);
        new GameObject("text1", this.mainMenu).setPosition(2.5, 1).addComponent(TextRenderer).setText("1.继续游戏").setQueue(Config.QUEUE_UI);
        new GameObject("text2", this.mainMenu).setPosition(2.5, 2).addComponent(TextRenderer).setText("2.新 游 戏").setQueue(Config.QUEUE_UI);
        new GameObject("text3", this.mainMenu).setPosition(2.5, 3).addComponent(TextRenderer).setText("3.加载存档").setQueue(Config.QUEUE_UI);
        this.mainMenuArror = new GameObject("arrow", this.mainMenu).setPosition(1, 1)
        this.mainMenuArror.addComponent(TextRenderer).setText("▶").setQueue(Config.QUEUE_UI);
    }

    addNewHeroMenu() {
        this.newHeroMenu = new GameObject("newHeroMenu", this.gameObject);
        new GameObject("text1", this.newHeroMenu).setPosition(3, 1).addComponent(TextRenderer).setText("1.武士").setQueue(Config.QUEUE_UI);
        new GameObject("text2", this.newHeroMenu).setPosition(3, 2).addComponent(TextRenderer).setText("2.魔法师").setQueue(Config.QUEUE_UI);
        new GameObject("text2", this.newHeroMenu).setPosition(3, 3).addComponent(TextRenderer).setText("3.道士").setQueue(Config.QUEUE_UI);
        this.newHeroArror = new GameObject("arrow", this.newHeroMenu).setPosition(1, 1)
        this.newHeroArror.addComponent(TextRenderer).setText("▶").setQueue(Config.QUEUE_UI);
        this.newHeroMenu.setActive(false);
    }

    newHero() {
        this.mainMenu.setActive(false);
        this.newHeroMenu.setActive(true);
        this.newHeroArror.y = 1;
    }
}
