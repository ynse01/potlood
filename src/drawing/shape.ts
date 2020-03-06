import { Point } from "../utils/math/point.js";
import { Box } from "../utils/math/box.js";
import { ShapeGuide } from "./shape-guide.js";
import { PointGuide } from "./point-guide.js";
import { ShapePath } from "./shape-path.js";

export class Shape {
    public width: number = 1;
    public height: number = 1;
    public fillColor: string | undefined = undefined;
    public lineColor: string | undefined = undefined;

    public guide: ShapeGuide;
    public paths: ShapePath[];

    constructor() {
        this.guide = new ShapeGuide(this);
        this.paths = [];
        this.paths.push(new ShapePath(this.guide));
    }

    public translate(offset: Point): void {
        this.paths.forEach(segment => {
            segment.translate(offset);
        });
    }

    public scale(scaling: Point): void {
        this.paths.forEach(segment => {
            segment.scale(scaling);
        });
    }

    public addSegmentMove(point: PointGuide): void {
        this.paths[this.paths.length - 1].moveTo(point);
    }

    public addSegmentLine(point: PointGuide): void {
        this.paths[this.paths.length - 1].lineTo(point);
    }

    public addSegmentArc(sweepAngle: string, startAngle: string, radiusX: string, radiusY: string): void {
        this.paths[this.paths.length - 1].arcTo(sweepAngle, startAngle, radiusX, radiusY);
    }

    public addSegmentQuadBezier(endPoint: PointGuide, control: PointGuide): void {
        this.paths[this.paths.length - 1].quadBezierTo(endPoint, control);
    }

    public addSegmentCubicBezier(point: PointGuide, control1: PointGuide, control2: PointGuide): void {
        this.paths[this.paths.length - 1].cubicBezierTo(point, control1, control2);
    }

    public addSegmentClose(): void {
        this.paths[this.paths.length - 1].close();
    }

    public addPath(filledIn: boolean, stroked: boolean) {
        this.paths.push(new ShapePath(this.guide, filledIn, stroked));
    }

    public performLayout(bounds: Box): void {
        const scalingX = bounds.width / this.width;
        const scalingY = bounds.height / this.height;
        this.scale(new Point(scalingX, scalingY));
        this.translate(bounds.topLeft);
    }

    public clone(): Shape {
        const clone = new Shape();
        clone.width = this.width;
        clone.height = this.height;
        clone.guide = this.guide;
        clone.lineColor = this.lineColor;
        clone.fillColor = this.fillColor;
        clone.paths = this.paths.map((path) => path.clone());
        return clone;
    }
}