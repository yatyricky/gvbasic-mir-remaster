import Config from "../Config";
import { subscribe } from "../EventBus";
import GameObject from "../gameObjs/GameObject";
import { strWrap } from "../Utils";
import Component from "./Component";
import TextRenderer from "./TextRenderer";

export default class ToastHandler extends Component {
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
        this.backdrop.addComponent(TextRenderer).setText(base).setQueue(Config.QUEUE_MODAL);
    }

    addTextRenderer() {
        this.textObj = new GameObject("child", this.gameObject).setPosition(1, 1);
        this.tr = this.textObj.addComponent(TextRenderer).setQueue(Config.QUEUE_MODAL);
    }

    /**
     * 
     * @param {string} key 
     */
    onInput(key) {
        this.show(false);
    }

    /**
     * 
     * @param {boolean} flag 
     */
    show(flag) {
        this.backdrop.active = flag;
        this.textObj.active = flag;
    }
}
