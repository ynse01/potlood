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
        const x = this.center.x + this.radiusX * Math.cos(radians);
        const y = this.center.y + this.radiusY * Math.sin(radians);
        return new Point(x, y);
    }
}