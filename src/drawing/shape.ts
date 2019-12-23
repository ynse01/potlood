import { Vector } from "../math/vector.js";
import { Box } from "../math/box.js";
import { Circle } from "../math/circle.js";

interface IPathSegment {
    translate(offset: Vector): void;
    scale(scaling: Vector): void;
    buildPath(): string;
}
class MoveTo implements IPathSegment {    
    constructor(public point: Vector) {
    }

    public translate(offset: Vector): void {
        this.point = this.point.translate(offset);
    }

    public scale(scaling: Vector): void {
        this.point = this.point.scale(scaling);
    }

    public buildPath(): string {
        return `M ${this.point.x} ${this.point.y}`;
    }
}

class LineTo extends MoveTo {
    public buildPath(): string {
        return `L ${this.point.x} ${this.point.y}`;
    }
}

class CircleTo implements IPathSegment {
    constructor(public circle: Circle, public angle: number) {
    }

    public translate(offset: Vector): void {
        this.circle.center = this.circle.center.translate(offset);
    }

    public scale(scaling: Vector): void {
        this.circle.center = this.circle.center.scale(scaling);
        this.circle.radius = this.circle.radius * scaling.x;
    }

    public buildPath(): string {
        const la = "0";
        const ps = "1";
        const point = this.circle.pointAtAngle(this.angle);
        return ` A ${this.circle.radius} ${this.circle.radius} 0 ${la} ${ps} ${point.x} ${point.y}`;
    }
}

class CubicBezierTo implements IPathSegment {
    constructor(public point: Vector, public control1: Vector, public control2: Vector) {
    }

    public translate(offset: Vector): void {
        this.point = this.point.translate(offset);
        this.control1 = this.control1.translate(offset);
        this.control2 = this.control2.translate(offset);
    }

    public scale(scaling: Vector): void {
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

    public translate(offset: Vector): void {
        this.segments.forEach(segment => {
            segment.translate(offset);
        });
    }

    public scale(scaling: Vector): void {
        this.segments.forEach(segment => {
            segment.scale(scaling);
        });
    }

    public addSegmentMove(point: Vector): void {
        this.segments.push(new MoveTo(point));
    }

    public addSegmentLine(point: Vector): void {
        this.segments.push(new LineTo(point));
    }

    public addSegmentCircle(circle: Circle, angle: number): void {
        this.segments.push(new CircleTo(circle, angle));
    }

    public addSegmentCubicBezier(point: Vector, control1: Vector, control2: Vector): void {
        this.segments.push(new CubicBezierTo(point, control1, control2));
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
        this.scale(new Vector(scalingX, scalingY));
        this.translate(bounds.topLeft);
    }
}