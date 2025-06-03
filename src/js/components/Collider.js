import SceneManager from "../SceneManager";
import Component from "./Component";

export default class Collider extends Component {
    onInit() {
        super.onInit();
        this.layer = 0;
        /**@type {Collider} */
        this.prevCollider = null;
    }

    /**
     * @param {Collider} other
     */
    onCollision(other) {
        this.callback?.(other);
    }
    /**
     * @param {Collider} other
     */
    onExitCollision(other) {
        this.exitCollision?.(other);
    }

    update() {
        SceneManager.colliderMap.set(this.gameObject.x, this.gameObject.y, this);
    }

    /**
     * 
     * @param {(other: Collider) => void} callback 
     * @returns 
     */
    setCallback(callback) {
        this.callback = callback;
        return this;
    }

        /**
     * 
     * @param {(other: Collider) => void} callback 
     * @returns 
     */
    setExitCollision(callback) {
        this.exitCollision = callback;
        return this;
    }

    /**
     * 
     * @param {number} layer 
     */
    setLayer(layer) {
        this.layer = layer;
        return this;
    }

    getInspector() {
        return `<strong>Collider</strong><br/>
        <table>
            <tr><td>Layer</td><td>${this.layer}</td></tr>
        </table>
`;
    }
}
