import { eps } from "../core/Constants.js"
// A rectangle.
export class Rectangle {
    center;
    hAxis;
    vAxis;
    width;
    height;
    material;
    normal;
    /**
     * center   : rectangle center
     * hAxis    : horizontal unit vector in plane
     * vAxis    : vertical unit vector in plane
     * width    : physical width
     * height   : physical height
     */
    constructor(center, hAxis, vAxis, width, height, material) {
        this.center = center;
        this.material = material;
        this.hAxis = hAxis.normalize();
        this.vAxis = vAxis.normalize();
        this.width = Math.abs(width);
        this.height = Math.abs(height);
        // Verify orthogonality
        const d = Math.abs(this.hAxis.dot(this.vAxis));
        if (d > eps) {
            throw new Error("hAxis and vAxis must be orthogonal");
        }
        this.normal = this.hAxis.cross(this.vAxis).normalize();
    }
    // Test whether a ray intersects the plane of the rectangle,
    // check that it lies within the rectangular area,
    // and return the closest forward hit.
    hit(ray) {
        const denom = ray.direction.dot(this.normal);
        if (Math.abs(denom) < 1e-6)
            return null;
        const t = this.center.sub(ray.origin).dot(this.normal) / denom;
        if (t < 0)
            return null;
        const p = ray.at(t);
        const rel = p.sub(this.center);
        const h = rel.dot(this.hAxis);
        const v = rel.dot(this.vAxis);
        if (Math.abs(h) > this.width / 2 ||
            Math.abs(v) > this.height / 2) {
            return null;
        }
        const facingNormal = denom < 0 ? this.normal : this.normal.mul(-1);
        return {
            t,
            p,
            normal: facingNormal.normalize(),
            material: this.material
        };
    }
    // Test whether a ray intersects the plane of the rectangle,
    // check that it lies within the rectangular area,
    // and return the closest forward hit.
    tphvHit(ray) {
        const denom = ray.direction.dot(this.normal);
        if (Math.abs(denom) < 1e-6)
            return null;
        const t = this.center.sub(ray.origin).dot(this.normal) / denom;
        if (t < 0)
            return null;
        const p = ray.at(t);
        const rel = p.sub(this.center);
        const h = rel.dot(this.hAxis) * 2 / this.width;
        const v = rel.dot(this.vAxis) * 2 / this.height;
        if (Math.abs(h) > 1 ||
            Math.abs(v) > 1) {
            return null;
        }
        return {
            t,
            p,
            h,
            v
        };
    }
}
