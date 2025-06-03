import KeyEvent from "../../KeyEvent";
import Const from "../../Const";
import { subscribe } from "../../EventBus";
import GameObject from "../../gameObjs/GameObject";
import Component from "../Component";
import RectRenderer from "../RectRenderer";
import Renderer from "../Renderer";
import TextRenderer from "../TextRenderer";
import { StatById } from "../../config/Stat";
import { strFormat, strWrap } from "../../Utils";
import { mathClamp } from "../../data/MathLab";
import { SkillById } from "../../config/Skill";

export default class InspectItem extends Component {
    onInit() {
        this.gameObject.addComponent(Renderer).setQueue(Const.QUEUE_UI);
        this.panel = new GameObject("inspectPanel", this.gameObject);
        this.panel.setActive(false);

        const backdrop = new GameObject("backdrop", this.panel);
        backdrop.addComponent(RectRenderer).setBgColor(Const.COLOR_BG).setSize(10, 5);

        this.textObj = new GameObject("text", this.panel);
        this.textRenderer = this.textObj.addComponent(TextRenderer);
        this.rows = 0;

        subscribe("inspect:item", this.updateItem.bind(this));
    }

    /**
     * 
     * @param {{ item: ItemSaveData, actionX?: () => void }} e 
     */
    updateItem(e) {
        if (e == null) {
            this.panel.setActive(false);
            return;
        }

        const { item, actionX } = e;
        this.actionX = actionX;
        this.panel.setActive(true);
        // const config = ItemById[item.id];
        let sb = `${item.name}
装等:${item.ilvl}
品质:${Const.QUALITY_TEXT[item.quality]}\n`;
        for (const [k, v] of Object.entries(item.stats)) {
            const statConfig = StatById[/**@type {StatId}*/(k)];
            let val = `${statConfig.name}+${Array.isArray(v) ? v.join('-') : v}`;
            if (statConfig.format === "int") {
                if (statConfig.type === "skillList") {
                    val = /**@type {any[]}*/(v).map(e => strFormat(statConfig.description, (e.chance * 100).toFixed(2), Math.floor(e.level), SkillById[/**@type {SkillId}*/(e.skill)].name)).join(";");
                } else {
                    if (Array.isArray(v)) {
                        val = `${statConfig.name}+${v.map(v => Math.floor(v)).join("-")}`;
                    } else {
                        val = `${statConfig.name}+${Math.floor(v)}`;
                    }
                }
            } else if (statConfig.format === "percent") {
                if (Array.isArray(v)) {
                    val = `${statConfig.name}+${v.map(v => `${v.toFixed(2)}%`).join("-")}`;
                } else {
                    val = `${statConfig.name}+${v.toFixed(2)}%`;
                }
            }
            sb += `${val}\n`;
        }
        this.rows = strWrap(sb).split("\n").length;

        this.textRenderer.setText(sb);
        this.textObj.setPosition(0, 0);
    }

    /**
     * 
     * @param {KeyEvent} e 
     */
    onInput(e) {
        if (!this.panel.active) {
            return;
        }
        if (e.key === "b") {
            e.use();
            this.panel.setActive(false);
        } else if (e.key === "u" || e.key === "d") {
            e.use();
            if (this.rows <= 5) {
                return; // No scrolling needed
            }
            // Scroll through the text
            this.textObj.setPosition(0, mathClamp(this.textObj.y + (e.key === "u" ? 1 : -1), 5 - this.rows, 0));
        } else if (e.key === "x" && this.actionX != null) {
            e.use();
            this.actionX();
        }
    }

    getInspector() {
        return `<strong>InspectItem</strong>
        <table>
        <tr><td>rows</td><td>${this.rows}</td></tr>
        </table>`
    }
}