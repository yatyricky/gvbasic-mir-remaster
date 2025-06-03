import GameObject from "../../gameObjs/GameObject";
import Component from "../Component";
import UIFocus from "../UIFocus";
import { subscribe } from "../../EventBus";

export default class SkillPanel extends Component {
    onInit() {
        this.container = new GameObject("container", this.gameObject);
        this.container.setPosition(0, 0).setSize(10, 4);
        this.uiFocus = this.gameObject.addComponent(UIFocus).setTarget(this.container).setDisableKeyB(true);

        this.refreshSkill();

        subscribe("skill:refresh", () => {
            this.refreshSkill();
        });
    }

    refreshSkill() {
        // this.container.clearChildren();
        // const hero = SceneManager.activeScene.find("game/hero").getComponent(UnitComponent);
        // let c = 0;
        // for (const skill of hero.persistantData.skills) {
        //     // const skillConfig = ItemById[skill.id];
        // }
    }
}