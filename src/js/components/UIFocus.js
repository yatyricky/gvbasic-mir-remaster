import Const from "../Const";
import GameObject from "../gameObjs/GameObject";
import KeyEvent from "../KeyEvent";
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
        this.rectRenderer = this.rectObj.addComponent(RectRenderer).setBorder(Const.COLOR_FG, 2).setQueue(Const.QUEUE_OVERLAY);
    }

    update() {
        if (this.focus == null || !this.focus.active) {
            this.focus = this.focusable.find((f) => f.active);
        }
        if (this.focus == null || !this.focus.active) {
            this.rectRenderer.setSize(0, 0);
            return;
        }
        this.rectRenderer.setSize(this.focus.w, this.focus.h);
        this.rectObj.setPosition(this.focus.x, this.focus.y);
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
                    "u": { x: 0, y: -1 },
                    "d": { x: 0, y: 1 },
                    "l": { x: -1, y: 0 },
                    "r": { x: 1, y: 0 }
                };

                // Get the current direction vector
                const dirVector = /**@type {any}*/(dirVectors)[e.key];

                // Filter only active elements
                const activeElements = this.focusable.filter(f => f.active && f !== this.focus);

                if (activeElements.length > 0) {
                    // Calculate scores for each element based on dot product and distance
                    const scoredElements = activeElements.map(element => {
                        // Vector from current focus to this element
                        const dx = element.x - this.focus.x;
                        const dy = element.y - this.focus.y;

                        // Calculate dot product (indicates alignment with direction)
                        const dotProduct = dx * dirVector.x + dy * dirVector.y;

                        // Square distance for normalization
                        const distance = dx * dx + dy * dy;

                        // Calculate angle penalization - the further from direction, the higher penalty
                        // We use 3 here as a weighting factor for the angle penalty
                        const anglePenalty = distance > 0 ? 3 * (1 - (dotProduct * dotProduct) / distance) : 0;

                        // Final score: prefer elements in the right direction
                        // Only consider elements with positive dot product (in the general direction)
                        // Normalize by distance and penalize for deviation from direct line
                        const score = dotProduct > 0 ? dotProduct / Math.sqrt(distance) - anglePenalty : -1000;

                        return { element, score };
                    });

                    // Sort by score, descending (higher score = better match)
                    scoredElements.sort((a, b) => b.score - a.score);

                    // Select the highest scoring element
                    const bestMatch = scoredElements[0];

                    // Only change focus if we found a reasonable match
                    if (bestMatch.score > -100) {
                        this.focus = bestMatch.element;
                    }
                }
            }

            // Fallback to original focus if nothing was found
            if (this.focus == null) {
                this.focus = old;
            }
        }

        this.input?.(e.key);
    }
}
