export default class Hierarchy {
    constructor() {
        this.active = true;
        this.children = [];
        this.parent = null;
    }

    setParent(parent) {
        if (this.parent != null) {
            this.parent.removeChild(this);
        }
        this.parent = parent;
        parent.children.push(this);
        return this;
    }

    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }
}
