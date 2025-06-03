import Const from "../Const";
import { mathClamp } from "../data/MathLab";
import KeyEvent from "../KeyEvent";
import SceneManager from "../SceneManager";
import Collider from "./Collider";
import Component from "./Component";

export default class CharacterController extends Component {
    constructor() {
        super();
    }

    /**
     * @override 
     * @param {KeyEvent} key
     */
    onInput(key) {
        // if (key === "a") {
        //     this.gameObject.getComponent("TextRenderer").setText(shuffleString(randomText));
        // }
        this.myCollider = this.gameObject.getComponent(Collider);
        let ox = this.gameObject.x;
        let oy = this.gameObject.y;

        let tx = ox;
        let ty = oy;

        if (key.key === "u") {
            ty--;
        }

        if (key.key === "d") {
            ty++;
        }

        if (key.key === "l") {
            tx--;
        }

        if (key.key === "r") {
            tx++;
        }

        const collider = SceneManager.colliderMap.get(tx, ty);
        if (collider != null) {
            collider.onCollision(this.gameObject.getComponent(Collider));
            if (collider.layer === Const.LAYER_NPC || collider.layer === Const.LAYER_WALL) {
                tx = ox;
                ty = oy;
            }
        }

        this.gameObject.x = mathClamp(tx, 0, 9);
        this.gameObject.y = mathClamp(ty, 0, 4);

        if (this.myCollider.prevCollider != null) {
            const distance = this.myCollider.prevCollider.gameObject.distanceTo(this.gameObject);
            if (distance > 1) {
                // If the previous collider is too far away, reset it
                this.myCollider.prevCollider.onExitCollision(this.myCollider);
            }
        }

        this.myCollider.prevCollider = collider;
    }
}
