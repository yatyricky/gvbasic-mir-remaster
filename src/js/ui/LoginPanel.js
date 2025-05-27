import userData from "../data/UserData";
import { dispatch } from "../EventBus";
import { arrLast, domClick, domShow } from "../Utils";

export default class LoginPanel {
    /**@type {LoginPanel} */
    static inst = null;
    /**
     * 
     * @param {string} id 
     */
    constructor(id) {
        LoginPanel.inst = this;

        this.dom = document.getElementById(id);

        domClick("lp-continue", this.clickContinue.bind(this));
        domClick("lp-new-hero", this.clickNewHero.bind(this));

        domClick("nhp-warr", () => this.createHero("warr"));
        domClick("nhp-mage", () => this.createHero("mage"));
        domClick("nhp-wlok", () => this.createHero("wlk"));
        domClick("nhp-close", () => domShow(this.newHeroPanel, false));

        this.newHeroPanel = document.getElementById("NewHeroPanel");
        requestAnimationFrame(() => {
            domShow(this.newHeroPanel, false);
        });
    }

    /**
     * 
     * @param {event} e 
     */
    clickContinue(e) {
        const last = arrLast(userData.data.chars);
        if (last == null) {
            dispatch("toast", "没有可使用的角色！");
        } else {
            dispatch("scene:game", null);
        }
    }

    /**
     * 
     * @param {event} e 
     */
    clickNewHero(e) {
        domShow(this.newHeroPanel, true);
    }

    /**
     * 
     * @param {UnitId} id 
     */
    createHero(id) {
        userData.addChar(id);
        domShow(this.newHeroPanel, false);
        dispatch("scene:game", null);
    }
}