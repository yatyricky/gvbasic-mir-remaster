import { subscribe } from "../EventBus";
import SceneManager from "../SceneManager";
import Component from "./Component";

export default class UIManager extends Component {
    constructor(){
        super();

        subscribe("panel:show", (ctor) => {
            const obj = ctor();
            obj.setParent(SceneManager.activeScene);
        })
    }
}
