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
        this.name = name ?? `GameObject (${Scene.activeScene?.children.length})`;
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

    addComponent(type) {
        if (this.components.has(type)) {
            console.warn(`Component of type ${type} already exists on ${this.name}`);
            return this.components.get(type);
        }
        const component = new type();
        component.gameObject = this;
        this.components.set(type, component);
        component.onInit?.();
        return component;
    }

    getComponent(type) {
        return this.components.get(type);
    }

    getComponents() {
        return this.components;
    }
}
