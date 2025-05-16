import Config from "../Config";
import { subscribe } from "../eventBus";
import GameObject from "../gameObjs/GameObject";
import { strWrap } from "../utils";
import TextRenderer from "./TextRenderer";

export default class ToastHandler {
    onInit() {
        this.addBackdrop();
        this.addTextRenderer();

        this.timeout = -1;
        subscribe("toast", (message) => {
            this.tr.setText(strWrap(message, 16));
            this.backdrop.active = true;
            this.textObj.active = true;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.backdrop.active = false;
                this.textObj.active = false;
            }, 1000);
        });
    }

    addBackdrop() {
        this.backdrop = new GameObject("child", this.gameObject);
        const base = `╔═══提示═══╗
║                ║
║                ║
║                ║
╚════════╝`;
        this.backdrop.addComponent(new TextRenderer(base).setQueue(Config.QUEUE_MODAL));
        this.backdrop.active = false;
    }

    addTextRenderer() {
        this.textObj = new GameObject("child", this.gameObject).setPosition(1, 1);
        this.tr = new TextRenderer().setQueue(Config.QUEUE_MODAL);
        this.textObj.addComponent(this.tr);
        this.textObj.active = false;
    }
}
