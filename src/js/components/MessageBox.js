import Const from "../Const";
import { mathClamp } from "../data/MathLab";
import Rect from "../data/Rect";
import GameObject from "../gameObjs/GameObject";
import KeyEvent from "../KeyEvent";
import { strWidth, strWrap } from "../Utils";
import Button from "./Button";
import Component from "./Component";
import RectRenderer from "./RectRenderer";
import Renderer from "./Renderer";
import TextRenderer from "./TextRenderer";
import UIFocus from "./UIFocus";

export default class MessageBox extends Component {
    constructor() {
        super();
        this.content = "";
    }

    onInit() {
        this.gameObject.addComponent(Renderer).setQueue(Const.QUEUE_UI);

        const backdrop = new GameObject("backdrop", this.gameObject);
        backdrop.addComponent(RectRenderer).setBgColor(Const.COLOR_BG).setBorder(Const.COLOR_FG, 2).setSize(10, 5);

        this.titleObj = new GameObject("title", this.gameObject);
        this.titleRenderer = this.titleObj.addComponent(TextRenderer);
        this.setTitle("提示");

        const contentObj = new GameObject("content", this.gameObject).setPosition(0, 1).setSize(10, 4);
        contentObj.addComponent(RectRenderer).setBgColor(Const.COLOR_BG).setSize(10, 4).setBorder(Const.COLOR_FG, 1);

        this.contentTextObj = new GameObject("contentText", contentObj);
        this.contentText = this.contentTextObj.addComponent(TextRenderer).setViewport(new Rect(0, 1, 10, 3));
        this.setContent("这是一个消息框这是一个消息框这是一个消息框这是一个消息框这是一个消息框这是一个消息框这是一个消息框这是一个消息框这是一个消息框这是一个消息框这是一个消息框这是一个消息框这是一个消息框这是一个消息框这是一个消息框这是一个消息框这是一个消息框");
        this.scrollY = 0;

        this.actionsContainer = new GameObject("actions", this.gameObject);

        this.focus = this.gameObject.addComponent(UIFocus);
    }

    /**
     * 
     * @param {string} content 
     */
    setContent(content) {
        this.content = content;
        this.contentText.setText(content);
        return this;
    }

    /**
     * 00112233445566778899
     * 1 4.5
     * 2 4
     * 3 3.5
     * @param { string} title 
     */
    setTitle(title) {
        const text = title.substring(0, 10);
        const width = strWidth(text);
        this.titleObj.setPosition((10 - width / 2) / 2, 0);
        this.titleRenderer.setText(text);
        return this;
    }

    /**
     * @param {string[]} actions
     */
    setActions(actions) {
        const allText = actions.join(" ");
        const width = strWidth(allText);
        if (width >= 20) {
            throw new Error("Actions text too long, max width is 20 characters.");
        }
        this.actionsContainer.setPosition((10 - width / 2) / 2, 4);
        let left = 0;
        for (let i = 0; i < actions.length; i++) {
            const action = actions[i];
            const myWidth = strWidth(action);

            const buttonObj = new GameObject(`action-${i}`, this.actionsContainer).setPosition(left, 0).setSize(myWidth / 2, 1);
            buttonObj.addComponent(TextRenderer).setText(action);
            left += myWidth / 2 + 0.5; // 0.5 for spacing
            buttonObj.addComponent(Button);
        }

        this.focus.setTarget(this.actionsContainer);
    }

    /**
     * 4 -1
     * 5 -2
     * @param {KeyEvent} e 
     */
    onInput(e) {
        e.use();
        if (e.key === "b") {
            this.gameObject.setActive(false);
        } else if (e.key === "u" || e.key === "d") {
            const lines = strWrap(this.content).split("\n");
            if (lines.length <= 3) {
                return; // No scrolling needed
            }

            this.scrollY = mathClamp(this.scrollY + (e.key === "u" ? 1 : -1), 3 - lines.length, 0);
            this.contentTextObj.setPosition(0, this.scrollY);
        }
    }
}
