import { Point } from "./point.js";

export class Circle {
    public radius: number;
    public center: Point;

    constructor(center: Point, radius: number) {
        this.center = center;
        this.radius = radius;
    }

    public pointAtAngle(radians: number): Point {
        const x = this.center.x + this.radius * Math.cos(radians);
        const y = this.center.y + this.radius * Math.sin(radians);
        return new Point(x, y);
    }
}