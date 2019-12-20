import { Vector } from "./vector.js";

export class Circle {
    public radius: number;
    public center: Vector;

    constructor(center: Vector, radius: number) {
        this.center = center;
        this.radius = radius;
    }

    public pointAtAngle(radians: number): Vector {
        const x = this.center.x + this.radius * Math.cos(radians);
        const y = this.center.y + this.radius * Math.sin(radians);
        return new Vector(x, y);
    }
}