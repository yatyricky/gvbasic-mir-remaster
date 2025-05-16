import Scene from "../gameObjs/Scene";
import Hierarchy from "./Hierarchy";

export default class GameObject extends Hierarchy {
    /**
     * 
     * @param {string} name 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(name, parent) {
        super();
        this.name = name ?? `GameObject (${Scene.activeScene.children.length})`;
        this.x = 0;
        this.y = 0;
        this.components = new Map();

        this.setParent(parent ?? Scene.activeScene);
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    onInput(key) {
        console.log(`${this.name}: Input received: ${key}`);
    }

    addComponent(component) {
        component.gameObject = this;
        this.components.set(component.constructor, component);
        component.onInit?.();
        return this;
    }

    getComponent(type) {
        return this.components.get(type);
    }

    getComponents() {
        return this.components;
    }
}
