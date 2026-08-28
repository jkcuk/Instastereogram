import { Rectangle } from "./Rectangle.js"
export class Text {
    center;
    hAxis;
    vAxis;
    width;
    height;
    text;
    font;
    material;
    rect;
    alpha;
    widthPx;
    heightPx;
    /**
     * Creates text as a rectangular textured surface.
     */
    constructor(center, hAxis, vAxis, width, height, text, font = "bold 64px sans-serif", material) {
        this.center = center;
        this.hAxis = hAxis;
        this.vAxis = vAxis;
        this.width = width;
        this.height = height;
        this.text = text;
        this.font = font;
        this.material = material;
        this.hAxis = hAxis.normalize().mul(width);
        this.vAxis = vAxis.normalize().mul(height);
        // underlying geometry
        this.rect = new Rectangle(center, hAxis, vAxis, width, height, material);
        // generate alpha mask
        const { alpha, w, h } = this.rasterizeText(text, font);
        this.alpha = alpha;
        this.widthPx = w;
        this.heightPx = h;
    }
    // --------------------------------------------------
    // Rasterise text to offscreen canvas
    // --------------------------------------------------
    rasterizeText(text, font) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        ctx.font = font;
        const metrics = ctx.measureText(text);
        // const scale = 2000; // pixels per unit (tune this)
        // const w = Math.ceil(this.width * scale);
        // const h = Math.ceil(this.height * scale);
        // const w = Math.ceil(metrics.width) + 10;
        // const h = Math.ceil(metrics.actualBoundingBoxAscent +
        //     metrics.actualBoundingBoxDescent) + 10;
        // canvas.width = w;
        // canvas.height = h;
        // // ctx.font = `bold ${h * 0.8}px sans-serif`;
        // ctx.font = font;
        // ctx.fillStyle = "#ffffff";
        // ctx.textBaseline = "middle";
        // ctx.textAlign = "center";
        // ctx.fillText(text, w / 2, h / 2);
        const padding = 20;

        const w =
            Math.ceil(metrics.width) +
            2 * padding;

        const h =
            Math.ceil(
                metrics.actualBoundingBoxAscent +
                metrics.actualBoundingBoxDescent
            ) +
            2 * padding;

        canvas.width = w;
        canvas.height = h;

        ctx.font = font;
        ctx.fillStyle = "#ffffff";
        ctx.textBaseline = "alphabetic";
        ctx.textAlign = "center";

        ctx.fillText(
            text,
            w / 2,
            padding +
            metrics.actualBoundingBoxAscent
        );
        const img = ctx.getImageData(0, 0, w, h);
        // Extract alpha channel
        const alpha = new Uint8ClampedArray(w * h);
        for (let i = 0; i < w * h; i++) {
            alpha[i] = img.data[i * 4 + 3];
        }
        return { alpha, w, h };
    }
    // --------------------------------------------------
    // Ray intersection
    // --------------------------------------------------
    hit(ray) {
        const baseHit = this.rect.hit(ray);
        if (!baseHit)
            return null;
        // compute local (h,v) coordinates in [-1,1]
        const rel = baseHit.p.sub(this.center);
        const hLen2 = this.hAxis.dot(this.hAxis);
        const vLen2 = this.vAxis.dot(this.vAxis);
        const u = rel.dot(this.hAxis) / hLen2 + 0.5;
        const w = 0.5 - rel.dot(this.vAxis) / vLen2;
        // const x = Math.floor(u * this.widthPx);
        // const y = Math.floor(w * this.heightPx);
        const x = Math.min(this.widthPx - 1, Math.max(0, Math.floor(u * this.widthPx)));
        const y = Math.min(this.heightPx - 1, Math.max(0, Math.floor(w * this.heightPx)));
        if (x < 0 || x >= this.widthPx || y < 0 || y >= this.heightPx) {
            return null;
        }
        const idx = y * this.widthPx + x;
        // alpha test
        if (this.alpha[idx] < 32) {
            return null;
        }
        return baseHit;
    }
}
