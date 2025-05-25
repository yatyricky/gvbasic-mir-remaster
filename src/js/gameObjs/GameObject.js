import Component from "../components/Component";
import SceneManager from "../SceneManager";
import { uuid } from "../Utils";

window.gameObjs = new Map();
// @ts-ignore
window.toggleActive = function (uuid) {
    const obj = window.gameObjs.get(uuid);
    if (obj == null) {
        console.warn(`GameObject ${uuid} not found`);
        return;
    }
    obj.setActive(!obj.active);
}

export default class GameObject {

    /**
     * 
     * @param {string} name 
     * @param {GameObject} parent 
     * @param {boolean} orphan
     */
    constructor(name, parent = null, orphan = false) {
        this.uuid = uuid();
        this._active = true;
        /** @type {GameObject[]}*/
        this.children = [];
        this.parent = null;
        this.name = name ?? `GameObject (${SceneManager.activeScene?.children.length})`;
        this.x = 0;
        this.y = 0;
        this.w = 1;
        this.h = 1;
        /** @type {Map<new() => Component, Component>} */
        this.components = new Map();

        if (!orphan) {
            this.setParent(parent ?? SceneManager.activeScene);
        }

        if (window.debug) {
            window.gameObjs.set(this.uuid, this);
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
     * @param {number} w 
     * @param {number} h 
     * @returns 
     */
    setSize(w, h) {
        this.w = w;
        this.h = h;
        return this;
    }

    _onEnableComp() {
        if (this.active) {
            for (const comp of this.components.values()) {
                comp.onEnable();
            }
            for (const child of this.children) {
                child._onEnableComp();
            }
        }
    }

    _onDisableComp(execOnce = false) {
        if (this.active || execOnce) {
            for (let i = this.children.length - 1; i >= 0; i--) {
                const child = this.children[i];
                child._onDisableComp();
            }
            for (const comp of this.components.values()) {
                comp.onDisable();
            }
        }
    }

    /**
     * 
     * @param {boolean} active 
     * @returns 
     */
    setActive(active) {
        const prev = this.active;
        this._active = active;
        if (!prev && active) {
            this._onEnableComp();
        }
        if (prev && !active) {
            this._onDisableComp(true);
        }
        return this;
    }

    /**
     * 
     * @returns {boolean}
     */
    parentActive() {
        if (this.parent == null) {
            return true;
        }
        return this.parent.active;
    }

    get active() {
        return this._active && this.parentActive();
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
        if (this.active) {
            component.onEnable();
        }
        return component;
    }

    /**
     * @template {Component} T
     * @param {new() => T} type 
     * @returns {T}
     */
    getComponent(type) {
        for (const [key, value] of this.components.entries()) {
            if (key === type || key.prototype instanceof type) {
                return /**@type {T}*/(value);
            }
        }
        return null;
    }

    getComponents() {
        return this.components.values();
    }

    /**
     * 
     * @param {string} name 
     * @returns {GameObject}
     */
    find(name) {
        const explode = name.split("/");
        if (explode.length === 1) {
            for (const child of this.children) {
                if (child.name === name) {
                    return child;
                }
            }
            return null;
        }
        let curr = /**@type {GameObject}*/(this);
        for (const part of explode) {
            curr = curr.find(part);
            if (curr == null) {
                return null;
            }
        }

        return curr;
    }

    update() {
    }

    getInspector() {
        let sb = [`<strong>GameObject</strong><br/>
            <table>
                <tr><td>uuid</td><td>${this.uuid}</td></tr>
                <tr><td>active</td><td onclick="toggleActive(${this.uuid})">${this.active ? "✅" : "⬛️"}</td></tr>
                <tr><td>position</td><td>(${this.x}, ${this.y})</td></tr>
            </table>`];
        for (const comp of this.getComponents()) {
            sb.push(comp.getInspector());
        }
        return sb.join("<br/>");
    }
}
