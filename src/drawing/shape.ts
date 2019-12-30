import { Point } from "../math/point.js";
import { Box } from "../math/box.js";
import { ShapeGuide } from "./shape-guide.js";
import { PointGuide } from "./point-guide.js";
import { Ellipse } from "../math/ellipse.js";
import { Angle } from "../math/angle.js";

abstract class PathSegment {
    protected _offset: Point = new Point(0, 0);
    protected _scaling: Point = new Point(1, 1);

    public translate(offset: Point): void {
        this._offset = offset;
    }

    public scale(scaling: Point): void {
        this._scaling = scaling;
    }

    abstract getEndPoint(guide: ShapeGuide, startPoint: Point): Point;
    abstract buildPath(guide: ShapeGuide, startPoint: Point): string;
    abstract clone(): PathSegment;

    protected convertPoint(point: PointGuide, guide: ShapeGuide): Point {
        return point.convertToPoint(guide).scale(this._scaling).translate(this._offset);
    }
}

class CloseSegment extends PathSegment {
    public getEndPoint(_guide: ShapeGuide, _startPoint: Point): Point {
        return new Point(0, 0);
    }

    public buildPath(_guide: ShapeGuide, _startPoint: Point): string {
        return " Z";
    }

    public clone(): CloseSegment {
        return new CloseSegment();
    }
}

class MoveTo extends PathSegment {
    constructor(public point: PointGuide) {
        super();
    }

    public getEndPoint(guide: ShapeGuide, _startPoint: Point): Point {
        return this.point.convertToPoint(guide);
    }

    public buildPath(guide: ShapeGuide, _startPoint: Point): string {
        const point = this.convertPoint(this.point, guide);
        return ` M ${point.x} ${point.y}`;
    }

    public clone(): MoveTo {
        return new MoveTo(this.point);
    }
}

class LineTo extends MoveTo {
    public getEndPoint(guide: ShapeGuide, _startPoint: Point): Point {
        return this.convertPoint(this.point, guide);
    }

    public buildPath(guide: ShapeGuide, _startPoint: Point): string {
        const point = this.convertPoint(this.point, guide);
        return ` L ${point.x} ${point.y}`;
    }

    public clone(): LineTo {
        return new LineTo(this.point);
    }
}

class ArcTo extends PathSegment {
    constructor(public sweepAngle: string, public startAngle: string, public radiusX: string, public radiusY: string) {
        super();
    }

    public getEndPoint(guide: ShapeGuide, startPoint: Point): Point {
        const startAngle = this._getAngleValue(guide, this.startAngle, false);
        let sweepAngle = this._getAngleValue(guide, this.sweepAngle, true);
        const radiusX = guide.getValue(this.radiusX) * this._scaling.x;
        const radiusY = guide.getValue(this.radiusY) * this._scaling.y;
        const ellipse = Ellipse.fromSinglePoint(startPoint, startAngle, radiusX, radiusY);
        return ellipse.pointAtAngle(startAngle.add(sweepAngle));
    }

    public buildPath(guide: ShapeGuide, startPoint: Point): string {
        let sweepAngle = this._getAngleValue(guide, this.sweepAngle, true);
        const la = (sweepAngle.toNormalized() > 0.5) ? "1" : "0";
        const radiusX = guide.getValue(this.radiusX) * this._scaling.x;
        const radiusY = guide.getValue(this.radiusY) * this._scaling.y;
        const endPoint = this.getEndPoint(guide, startPoint);
        console.log(`Start ${startPoint} to ${endPoint} with sweep ${sweepAngle.toString()}`);
        return ` A ${radiusX} ${radiusY} 0 ${la} 1 ${endPoint.x} ${endPoint.y}`;
    }

    public clone(): ArcTo {
        return new ArcTo(this.sweepAngle, this.startAngle, this.radiusX, this.radiusY);
    }

    private _getAngleValue(guide: ShapeGuide, variable: string, addFullRound: boolean): Angle {
        const val = guide.getValue(variable);
        const angle = Angle.fromRotation(val);
        angle.round(addFullRound);
        return angle;
    }
}

class CubicBezierTo extends PathSegment {
    constructor(public endPoint: PointGuide, public control1: PointGuide, public control2: PointGuide) {
        super();
    }

    public getEndPoint(guide: ShapeGuide, _startPoint: Point): Point {
        return this.convertPoint(this.endPoint, guide);
    }

    public buildPath(guide: ShapeGuide, _startPoint: Point): string {
        const endPoint = this.convertPoint(this.endPoint, guide);
        const control1 = this.convertPoint(this.control1, guide);
        const control2 = this.convertPoint(this.control2, guide);
        return ` C ${control1.x} ${control1.y}, ${control2.x} ${control2.y}, ${endPoint.x} ${endPoint.y}`;
    }

    public clone(): CubicBezierTo {
        return new CubicBezierTo(this.endPoint, this.control1, this.control2);
    }
}

class QuadBezierTo extends PathSegment {
    constructor(public endPoint: PointGuide, public control: PointGuide) {
        super();
    }

    public getEndPoint(guide: ShapeGuide, _startPoint: Point) {
        return this.convertPoint(this.endPoint, guide);
    }

    public buildPath(guide: ShapeGuide, startPoint: Point): string {
        const endPoint = this.convertPoint(this.endPoint, guide);
        const control = this.convertPoint(this.control, guide);
        const twoThird = 2 / 3;
        const cubic1 = startPoint.translate(Point.difference(control, startPoint).scale(twoThird));
        const cubic2 = endPoint.translate(Point.difference(control, endPoint).scale(twoThird));
        return ` C ${cubic1.x} ${cubic1.y}, ${cubic2.x} ${cubic2.y}, ${endPoint.x} ${endPoint.y}`;
    }

    public clone(): QuadBezierTo {
        return new QuadBezierTo(this.endPoint, this.control);
    }
}

export class Shape {
    public width: number = 1;
    public height: number = 1;
    public fillColor: string | undefined = undefined;
    public lineColor: string | undefined = undefined;

    public guide: ShapeGuide = new ShapeGuide(this);
    private segments: PathSegment[] = [];
    private _path: string | undefined = undefined;

    public translate(offset: Point): void {
        this.segments.forEach(segment => {
            segment.translate(offset);
        });
    }

    public scale(scaling: Point): void {
        this.segments.forEach(segment => {
            segment.scale(scaling);
        });
    }

    public addSegmentMove(point: PointGuide): void {
        this.segments.push(new MoveTo(point));
    }

    public addSegmentLine(point: PointGuide): void {
        this.segments.push(new LineTo(point));
    }

    public addSegmentArc(sweepAngle: string, startAngle: string, radiusX: string, radiusY: string): void {
        this.segments.push(new ArcTo(sweepAngle, startAngle, radiusX, radiusY));
    }

    public addSegmentQuadBezier(endPoint: PointGuide, control: PointGuide): void {
        this.segments.push(new QuadBezierTo(endPoint, control));
    }

    public addSegmentCubicBezier(point: PointGuide, control1: PointGuide, control2: PointGuide): void {
        this.segments.push(new CubicBezierTo(point, control1, control2));
    }

    public addSegmentClose(): void {
        this.segments.push(new CloseSegment());
    }

    public buildPath(): string {
        if (this._path === undefined) {
            this._path = "";
            this.guide.evaluate();
            let currentPoint: Point = new Point(0, 0);
            this.segments.forEach((segment => {
                this._path += segment.buildPath(this.guide, currentPoint);
                currentPoint = segment.getEndPoint(this.guide, currentPoint);
            }));
        }
        return this._path;
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
        clone.segments = this.segments.map((segment) => segment.clone());
        return clone;
    }
}