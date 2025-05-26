export default class Vec2 {
    /**
     * 
     * @param {number} [x] 
     * @param {number} [y] 
     */
    constructor(x, y) {
        this.x = x ?? 0;
        this.y = y ?? 0;
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    magnitudeSqr() {
        return this.x * this.x + this.y * this.y;
    }

    normalizeSelf() {
        const magSrq = this.x * this.x + this.y * this.y;
        if (magSrq === 1.0) {
            return this;
        }
        if (magSrq === 0.0) {
            console.warn("Vec2.normalizeSelf: Cannot normalize a zero vector");
            return this;
        }

        const invSqrt = 1.0 / Math.sqrt(magSrq);
        this.x *= invSqrt;
        this.y *= invSqrt;
        return this;
    }

    /**
     * @param {Vec2} v
     */
    setTo(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    /**
     * 
     * @param {Vec2} [out] 
     * @returns 
     */
    normalize(out) {
        out = out ?? new Vec2();
        out.setTo(this);
        out.normalizeSelf();
        return out;
    }

    /**
     * 
     * @param {Vec2} v 
     */
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
}
