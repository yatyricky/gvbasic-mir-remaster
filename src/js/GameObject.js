import Scene from "./Scene";

export default class GameObject {
    /**
     * 
     * @param {string} name 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(name, x, y) {
        this.name = name;
        this.x = x ?? 0;
        this.y = y ?? 0;
        this.components = new Map();

        Scene.activeScene.addGameObject(this);
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    onInput(key) {
        console.log(`${this.name}: Input received: ${key}`);
    }

    addComponent(component) {
        component.gameObject = this;
        this.components.set(component.constructor, component);
    }

    getComponent(type) {
        return this.components.get(type);
    }

    getComponents() {
        return this.components;
    }
}
