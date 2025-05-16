import userData from "../data/UserData";
import { dispatch } from "../eventBus";
import { arrLast } from "../utils";

export default class MenuController {
    onInput(key) {
        if (key === 'u') {
            this.gameObject.y = Math.max(1, this.gameObject.y - 1);
        } else if (key === 'd') {
            this.gameObject.y = Math.min(3, this.gameObject.y + 1);
        } else if (key === 'a') {
            switch (this.gameObject.y) {
                case 1:
                    const last = arrLast(userData.chars);
                    if (last == null) {
                        dispatch("toast", "没有可使用的角色！");
                    }
                    break;
                case 2:

                    break;
                case 3:

                    break;

                default:
                    break;
            }
        }
    }
}
