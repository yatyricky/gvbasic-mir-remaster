import { dispatch } from "../EventBus";
import { domClick, domShow } from "../Utils";
import BaseModal from "./BaseModal";

export default class GamePanel extends BaseModal {
    /** @type {GamePanel} */
    static inst = null;
    /**
     * 
     * @param {string} id 
     */
    constructor(id) {
        super(id);
        GamePanel.inst = this;

        const panel = document.getElementById("PanelContainer");
        panel.appendChild(this.dom);
        requestAnimationFrame(() => {
            domShow(this.dom, false);
        });

        domClick("game-exit", () => {
            dispatch("scene:login", null);
        });
    }
}