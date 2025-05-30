import userData from "../data/UserData";
import { dispatch } from "../EventBus";
import { arrLast, domClick } from "../Utils";
import BaseModal from "./BaseModal";
import NewHeroModal from "./NewHeroModal";

export default class LoginPanel extends BaseModal {
    /**@type {LoginPanel} */
    static inst = null;
    /**
     * 
     * @param {string} id 
     */
    constructor(id) {
        super(id);
        LoginPanel.inst = this;

        const panel = document.getElementById("PanelContainer");
        panel.appendChild(this.dom);

        domClick("lp-continue", this.clickContinue.bind(this));
        domClick("lp-new-hero", this.clickNewHero.bind(this));

        this.newHeroPanel = new NewHeroModal("NewHeroPanel");
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
        dispatch("modal:open", this.newHeroPanel);
    }
}