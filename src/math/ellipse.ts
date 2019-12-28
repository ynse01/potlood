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

    public static fromSinglePoint(point: Point, angle: number, radiusX: number, radiusY: number): Ellipse {
        const localRadius = Ellipse._localRadius(angle, radiusX, radiusY);
        const center = new Point(point.x - (localRadius * Math.cos(angle)), point.y - (localRadius * Math.sin(angle)));
        return new Ellipse(center, radiusX, radiusY);
    }

    public pointAtAngle(radians: number): Point {
        // Ellipse has radius which changes with angle.
        const radius = this.localRadius(radians);
        const x = this.center.x + radius * Math.cos(radians);
        const y = this.center.y + radius * Math.sin(radians);
        return new Point(x, y);
    }

    public localRadius(radians: number): number {
        return Ellipse._localRadius(radians, this.radiusX, this.radiusY);
    }

    public clone(): Ellipse {
        return new Ellipse(this.center.clone(), this.radiusX, this.radiusY);
    }

    private static _localRadius(radians: number, radiusX: number, radiusY: number): number {
        // Taken from polar representation of Ellipse.
        const a = radiusX * Math.sin(radians);
        const b = radiusY * Math.cos(radians);
        const ab = radiusX * radiusY;
        return ab / Math.sqrt((b * b) + (a * a));
    }
}