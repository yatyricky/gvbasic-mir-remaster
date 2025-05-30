import userData from "../data/UserData";
import { dispatch } from "../EventBus";
import { domClick } from "../Utils";
import BaseModal from "./BaseModal";

export default class NewHeroModal extends BaseModal {
    /** @type {NewHeroModal} */
    static inst = null;

    /**
     * 
     * @param {string} id 
     */
    constructor(id) {
        super(id);
        NewHeroModal.inst = this;

        domClick("nhp-warr", () => this.createHero("warr"));
        domClick("nhp-mage", () => this.createHero("mage"));
        domClick("nhp-wlok", () => this.createHero("wlk"));
        domClick("nhp-close", this.close.bind(this));
    }

    /**
     * 
     * @param {UnitId} id 
     */
    createHero(id) {
        userData.addChar(id);
        this.close();
        dispatch("scene:game", null);
    }

    close() {
        dispatch("modal:close", this);
    }
}