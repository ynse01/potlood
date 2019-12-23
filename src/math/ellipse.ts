import { Point } from "./point.js";

export class Ellipse {
    public radiusX: number;
    public radiusY: number;
    public center: Point;

    constructor(center: Point, radiusX: number, radiusY: number) {
        this.center = center;
        this.radiusX = radiusX;
        this.radiusY = radiusY;
    }

    public pointAtAngle(radians: number): Point {
        const radius = this.localRadius(radians);
        const x = this.center.x + radius * Math.cos(radians);
        const y = this.center.y + radius * Math.sin(radians);
        return new Point(x, y);
    }

    public localRadius(radians: number): number {
        const a = this.radiusX * Math.sin(radians);
        const b = this.radiusY * Math.cos(radians);
        const ab = this.radiusX * this.radiusY;
        return ab / Math.sqrt((b * b) + (a * a));
    }

    public clone(): Ellipse {
        return new Ellipse(this.center.clone(), this.radiusX, this.radiusY);
    }
}