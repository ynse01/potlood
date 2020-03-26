import { Point } from "../utils/geometry/point.js";
import { ShapeGuide } from "./shape-guide.js";

export class PointGuide {
    public x: string;
    public y: string;
    
    constructor(x: string, y: string) {
        this.x = x;
        this.y = y;
    }

    public static fromPoint(point: Point): PointGuide {
        return new PointGuide(point.x.toString(), point.y.toString());
    }

    public convertToPoint(guide: ShapeGuide): Point {
        const x = guide.getValue(this.x);
        const y = guide.getValue(this.y);
        return new Point(x, y);
    }
}