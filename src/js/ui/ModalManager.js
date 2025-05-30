import { subscribe } from "../EventBus";
import { domShow } from "../Utils";
import BaseModal from "./BaseModal";

export default class ModalManager {
    /**@type {ModalManager} */
    static inst = null;
    /**
     * 
     * @param {string} id 
     */
    constructor(id) {
        ModalManager.inst = this;
        this.domWrapper = document.getElementById(id);
        this.container = document.getElementById("ModalContainer");
        /** @type {BaseModal[]} */
        this.modals = [];

        subscribe("modal:open", (data) => {
            this.modals.push(data);
            this.update();
        });

        subscribe("modal:close", (data) => {
            const index = this.modals.indexOf(data);
            if (index !== -1) {
                this.modals.splice(index, 1);
            }
            this.update();
        });

        this.update();
    }

    update() {
        domShow(this.domWrapper, this.modals.length > 0);
        this.container.innerHTML = "";
        for (const modal of this.modals) {
            this.container.appendChild(modal.dom);
        }
    }
}