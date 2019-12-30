import { Point } from "./point.js";
import { Angle } from "./angle.js";

export class Ellipse {
    public radiusX: number;
    public radiusY: number;
    public center: Point;

    constructor(center: Point, radiusX: number, radiusY: number) {
        this.center = center;
        this.radiusX = radiusX;
        this.radiusY = radiusY;
    }

    public static fromSinglePoint(point: Point, angle: Angle, radiusX: number, radiusY: number): Ellipse {
        const radians = angle.toRadians();
        const localRadius = Ellipse._localRadius(radians, radiusX, radiusY);
        const center = new Point(point.x - (localRadius * Math.cos(radians)), point.y - (localRadius * Math.sin(radians)));
        return new Ellipse(center, radiusX, radiusY);
    }

    public pointAtAngle(angle: Angle): Point {
        // Ellipse has radius which changes with angle.
        const radians = angle.toRadians();
        const radius = this.localRadius(angle);
        const x = this.center.x + radius * Math.cos(radians);
        const y = this.center.y + radius * Math.sin(radians);
        return new Point(x, y);
    }

    public localRadius(angle: Angle): number {
        const radians = angle.toRadians();
        return Ellipse._localRadius(radians, this.radiusX, this.radiusY);
    }

    public clone(): Ellipse {
        return new Ellipse(this.center.clone(), this.radiusX, this.radiusY);
    }

    private static _localRadius(radians: number, radiusX: number, radiusY: number): number {
        // Taken from polar representation of Ellipse.
        const a = radiusX * Math.cos(radians);
        const b = radiusY * Math.sin(radians);
        const ab = radiusX * radiusY;
        return ab / Math.sqrt((b * b) + (a * a));
    }
}