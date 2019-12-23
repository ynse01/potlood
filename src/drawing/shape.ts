import { Point } from "../math/point.js";
import { Box } from "../math/box.js";
import { Ellipse } from "../math/ellipse.js";

interface IPathSegment {
    translate(offset: Point): void;
    scale(scaling: Point): void;
    buildPath(): string;
}

class CloseSegment implements IPathSegment {
    public translate(_offset: Point): void {
        // Nothing to do.
    }
    
    public scale(_scaling: Point): void {
        // Nothing to do.
    }
    buildPath(): string {
        return " Z";
    }


}

class MoveTo implements IPathSegment {    
    constructor(public point: Point) {
    }

    public translate(offset: Point): void {
        this.point = this.point.translate(offset);
    }

    public scale(scaling: Point): void {
        this.point = this.point.scale(scaling);
    }

    public buildPath(): string {
        return ` M ${this.point.x} ${this.point.y}`;
    }
}

class LineTo extends MoveTo {
    public buildPath(): string {
        return `L ${this.point.x} ${this.point.y}`;
    }
}

class ArcTo implements IPathSegment {
    constructor(public ellipse: Ellipse, public angle: number, public largeArc: boolean, public sweep: boolean) {
    }

    public translate(offset: Point): void {
        this.ellipse.center = this.ellipse.center.translate(offset);
    }

    public scale(scaling: Point): void {
        this.ellipse.center = this.ellipse.center.scale(scaling);
        this.ellipse.radiusX = this.ellipse.radiusX * scaling.x;
        this.ellipse.radiusY = this.ellipse.radiusY * scaling.y;
    }

    public buildPath(): string {
        const la = this.largeArc ? "1" : "0";
        const ps = this.sweep ? "1" : "0";
        const point = this.ellipse.pointAtAngle(this.angle);
        return ` A ${this.ellipse.radiusX} ${this.ellipse.radiusY} 0 ${la} ${ps} ${point.x} ${point.y}`;
    }
}

class CubicBezierTo implements IPathSegment {
    constructor(public point: Point, public control1: Point, public control2: Point) {
    }

    public translate(offset: Point): void {
        this.point = this.point.translate(offset);
        this.control1 = this.control1.translate(offset);
        this.control2 = this.control2.translate(offset);
    }

    public scale(scaling: Point): void {
        this.point = this.point.scale(scaling);
        this.control1 = this.control1.scale(scaling);
        this.control2 = this.control2.scale(scaling);
    }

    public buildPath(): string {
        return ` C ${this.control1.x} ${this.control1.y}, ${this.control2.x} ${this.control2.y}, ${this.point.x} ${this.point.y}`;
    }
}

export class Shape {
    public width: number = 1;
    public height: number = 1;
    public fillColor: string | undefined = undefined;
    public lineColor: string | undefined = undefined;

    private segments: IPathSegment[] = [];
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

    public addSegmentMove(point: Point): void {
        this.segments.push(new MoveTo(point));
    }

    public addSegmentLine(point: Point): void {
        this.segments.push(new LineTo(point));
    }

    public addSegmentArc(ellipse: Ellipse, angle: number, largeArc: boolean, sweep: boolean): void {
        this.segments.push(new ArcTo(ellipse, angle, largeArc, sweep));
    }

    public addSegmentCubicBezier(point: Point, control1: Point, control2: Point): void {
        this.segments.push(new CubicBezierTo(point, control1, control2));
    }

    public addSegmentClose(): void {
        this.segments.push(new CloseSegment());
    }

    public buildPath(): string {
        if (this._path === undefined) {
            this._path = "";
            this.segments.forEach((segment => {
                this._path += segment.buildPath();
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
}