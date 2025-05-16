import Config from "../Config";
import { subscribe } from "../eventBus";
import GameObject from "../gameObjs/GameObject";
import { strWrap } from "../utils";
import TextRenderer from "./TextRenderer";

export default class ToastHandler {
    onInit() {
        this.addBackdrop();
        this.addTextRenderer();
        this.show(false);

        this.timeout = -1;
        subscribe("toast", (message) => {
            this.tr.setText(strWrap(message, 16));
            this.show(true);
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.show(false);
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
    }

    addTextRenderer() {
        this.textObj = new GameObject("child", this.gameObject).setPosition(1, 1);
        this.tr = new TextRenderer().setQueue(Config.QUEUE_MODAL);
        this.textObj.addComponent(this.tr);
    }

    onInput(key) {
        this.show(false);
    }

    show(flag) {
        this.backdrop.active = flag;
        this.textObj.active = flag;
    }
}
