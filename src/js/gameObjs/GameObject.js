import Component from "../components/Component";
import SceneManager from "../SceneManager";

export default class GameObject {
    /**
     * 
     * @param {string} name 
     * @param {GameObject} parent 
     * @param {boolean} orphan
     */
    constructor(name, parent = null, orphan = false) {
        this._active = true;
        /** @type {GameObject[]}*/
        this.children = [];
        this.parent = null;
        this.name = name ?? `GameObject (${SceneManager.activeScene?.children.length})`;
        this.x = 0;
        this.y = 0;
        /** @type {Map<new() => Component, Component>} */
        this.components = new Map();

        if (!orphan) {
            this.setParent(parent ?? SceneManager.activeScene);
        }
    }

    /**
     * 
     * @param {GameObject} parent 
     * @returns 
     */
    setParent(parent) {
        if (this.parent != null) {
            this.parent.removeChild(this);
        }
        this.parent = parent;
        parent.children.push(this);
        return this;
    }

    /**
     * 
     * @param {GameObject} child 
     */
    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @returns 
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    /**
     * 
     * @param {boolean} active 
     * @returns 
     */
    setActive(active) {
        this._active = active;
        return this;
    }

    get active() {
        return this._active;
    }

    /**
     * @template {Component} T
     * @param {new() => T} type 
     * @returns {T}
     */
    addComponent(type) {
        if (this.components.has(type)) {
            console.warn(`Component of type ${type} already exists on ${this.name}`);
            return /**@type {T}*/(this.components.get(type));
        }
        const component = new type();
        component.gameObject = this;
        this.components.set(type, component);
        component.onInit();
        return component;
    }

    /**
     * @template {Component} T
     * @param {new() => T} type 
     * @returns {T}
     */
    getComponent(type) {
        return /**@type {T}*/(this.components.get(type));
    }

    getComponents() {
        return this.components;
    }

    /**
     * 
     * @param {string} name 
     * @returns {GameObject}
     */
    find(name) {
        for (const child of this.children) {
            if (child.name === name) {
                return child;
            }
        }
        return null;
    }

    update() {
    }
}
