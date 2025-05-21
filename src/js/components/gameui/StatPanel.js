import Const from "../../Const";
import GameObject from "../../../js/gameObjs/GameObject";
import SceneManager from "../../SceneManager";
import Component from "../Component";
import TextRenderer from "../TextRenderer";
import UnitComponent from "../UnitComponent";

import KeyEvent from "../../KeyEvent";
import { strWrap } from "../../Utils";
import { StatById } from "../../configData/Stat";

export default class StatPanel extends Component {
    onInit() {
        super.onInit();

        this.stat = SceneManager.activeScene.find("game/hero").getComponent(UnitComponent).stat;

        this.objStat = new GameObject("hp", this.gameObject).setPosition(0, 1);
        this.tr = this.objStat.addComponent(TextRenderer).setBgColor(Const.COLOR_BG);
        this.scrollY = 0;
        /**@type {string[]} */
        this.lines = [];
    }

    onEnable() {
        this.updateText();
    }

    /**
     * 
     * @param {KeyEvent} e 
     */
    onInput(e) {
        if (e.key === "u" || e.key === "d") {
            e.use();

            this.updateText(() => {
                if (e.key === "u") {
                    this.scrollY = Math.max(0, this.scrollY - 1);
                } else {
                    this.scrollY = Math.min(this.scrollY + 1, Math.max(this.lines.length - 4, 0));
                }
            })
        }
    }

    /**
     * 
     * @param {function} [updateScrollY]
     */
    updateText(updateScrollY) {
        let sb = "";
        sb += `LV: 经验${this.stat.getStat("exp")}\n`;
        sb += `${StatById.rthp.name}:${this.stat.getStat("rthp")}/${this.stat.getStat("rtmaxhp")}\n`;
        sb += `${StatById.rtmp.name}:${this.stat.getStat("rtmp")}/${this.stat.getStat("rtmaxmp")}\n`;
        sb += `${StatById.xatk.name}:${this.stat.getStat("xatk")}\n`;
        sb += `${StatById.matk.name}:${this.stat.getStat("matk")}\n`;
        sb += `${StatById.watk.name}:${this.stat.getStat("watk")}\n`;
        if (!this.stat.getStat("xdr").isZero()) sb += `${StatById.xdr.name}:${this.stat.getStat("xdr")}\n`;
        if (!this.stat.getStat("fdr").isZero()) sb += `${StatById.fdr.name}:${this.stat.getStat("fdr")}\n`;
        if (!this.stat.getStat("tdr").isZero()) sb += `${StatById.tdr.name}:${this.stat.getStat("tdr")}\n`;
        if (!this.stat.getStat("hdr").isZero()) sb += `${StatById.hdr.name}:${this.stat.getStat("hdr")}\n`;
        if (!this.stat.getStat("pdr").isZero()) sb += `${StatById.pdr.name}:${this.stat.getStat("pdr")}\n`;
        if (this.stat.getStat("rtxres") !== 0) sb += `${StatById.rtxres.name}:${this.stat.getStat("rtxres")}\n`;
        if (this.stat.getStat("rtfres") !== 0) sb += `${StatById.rtfres.name}:${this.stat.getStat("rtfres")}\n`;
        if (this.stat.getStat("rttres") !== 0) sb += `${StatById.rttres.name}:${this.stat.getStat("rttres")}\n`;
        if (this.stat.getStat("rthres") !== 0) sb += `${StatById.rthres.name}:${this.stat.getStat("rthres")}\n`;
        if (this.stat.getStat("rtpres") !== 0) sb += `${StatById.rtpres.name}:${this.stat.getStat("rtpres")}\n`;
        this.lines = strWrap(sb).split("\n");
        updateScrollY?.();
        this.tr.setText(this.lines.slice(this.scrollY, this.scrollY + 4).join("\n"));
    }
}
