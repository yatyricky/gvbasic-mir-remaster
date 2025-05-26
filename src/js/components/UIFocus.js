import Const from "../Const";
import { mathFuzzyEquals } from "../data/MathLab";
import Vec2 from "../data/Vec2";
import GameObject from "../gameObjs/GameObject";
import KeyEvent from "../KeyEvent";
import SceneManager from "../SceneManager";
import Button from "./Button";
import Component from "./Component";
import RectRenderer from "./RectRenderer";

export default class UIFocus extends Component {
    constructor() {
        super();
        /**@type {GameObject} */
        this.focus = null;
        /**@type {GameObject[]} */
        this.focusable = [];
        /**@type {(key: string) => void} */
        this.input = null;
    }

    onInit() {
        this.rectObj = new GameObject("rect", this.gameObject);
        this.rectRenderer = this.rectObj.addComponent(RectRenderer).setBorder(Const.COLOR_FG, 2);
        this.target = this.gameObject;
    }

    onEnable() {
        this.focusable = [];
        this.focus = null;
        for (const child of this.target.children) {
            if (child.active && child.getComponent(Button)) {
                this.focusable.push(child);
                if (this.focus == null) {
                    this.focus = child; // Set the first active focusable element as the initial focus
                }
            }
        }
    }

    /**
     * 
     * @param {GameObject} target 
     */
    setTarget(target) {
        this.target = target;
    }

    /**
     * @override
     * @param {number} dt 
     * @returns 
     */
    update(dt) {
        if (this.focus == null || !this.focus.active) {
            this.focus = this.focusable.find((f) => f.active);
        }
        if (this.focus == null || !this.focus.active) {
            this.rectRenderer.setSize(0, 0);
            return;
        }
        this.rectRenderer.setSize(this.focus.w, this.focus.h);
        this.rectRenderer.setBorder(`rgba(1, 29, 1, ${Math.cos(SceneManager.activeScene.time * 3) * 0.5 + 0.5})`, 2);
        this.rectObj.setPosition(this.target.x + this.focus.x, this.target.y + this.focus.y);
    }

    /**
     * 
     * @param {(key: string) => void} input 
     */
    setInput(input) {
        this.input = input;
        return this;
    }

    /**
     * 
     * @param {KeyEvent} e
     */
    onInput(e) {
        e.use();
        if (this.focus != null) {
            const old = this.focus;

            // Handle action button
            if (e.key === "a") {
                this.focus.getComponent(Button)?.onClick();
            } else if (["u", "d", "l", "r"].includes(e.key)) {
                // Define direction vectors
                const dirVectors = {
                    "u": new Vec2(0, -1),
                    "d": new Vec2(0, 1),
                    "l": new Vec2(-1, 0),
                    "r": new Vec2(1, 0)
                };

                // Get the current direction vector
                const dirVector = /**@type {any}*/(dirVectors)[e.key];

                // Filter only active elements
                const activeElements = this.focusable.filter(f => f.active && f !== this.focus);

                if (activeElements.length > 0) {
                    // Calculate scores for each element based on dot product and distance
                    const scoredElements = activeElements.map(element => {
                        // Vector from current focus to this element
                        const v = new Vec2(element.x - this.focus.x, element.y - this.focus.y);
                        const vNorm = v.normalize();

                        // Calculate dot product (indicates alignment with direction)
                        const score = vNorm.dot(dirVector);

                        // Square distance for normalization
                        const distance = v.magnitudeSqr();

                        // Final score: prefer elements in the right direction
                        // Only consider elements with positive dot product (in the general direction)
                        // Normalize by distance and penalize for deviation from direct line

                        return { element, score, distance };
                    });

                    // Sort by score decending, and distance ascending
                    scoredElements.sort((a, b) => {
                        if (mathFuzzyEquals(a.score, b.score, 0.01)) {
                            return a.distance - b.distance; // If scores are equal, prefer closer elements
                        }
                        return b.score - a.score;
                    });

                    // Select the highest scoring element
                    const bestMatch = scoredElements[0];

                    // Only change focus if we found a reasonable match
                    if (bestMatch.score > 0.9) {
                        this.focus = bestMatch.element;
                    }
                }
            }

            // Fallback to original focus if nothing was found
            if (this.focus == null) {
                this.focus = old;
            }
        }

        if (e.key === "b") {
            this.gameObject.setActive(false);
        }

        this.input?.(e.key);
    }

    getInspector() {
        return `<strong>UIFocus</strong><br/>
            <table>
                <tr><td>focus</td><td>${this.focus ? this.focus.name : "null"}</td></tr>
                <tr><td>focusable</td><td>${this.focusable.length}</td></tr>
            </table>`;
    }
}
