import { Vector } from "../math/vector.js";
import { PathBuilder } from "./path-builder.js";
import { Box } from "../math/box.js";
import { Circle } from "../math/circle.js";

interface IPathSegment {
    translate(offset: Vector): void;
    scale(scaling: Vector): void;
    buildPath(builder: PathBuilder): void;
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

    public buildPath(builder: PathBuilder): void {
        builder.moveTo(this.point);
    }
}

class LineTo extends MoveTo {
    public buildPath(builder: PathBuilder): void {
        builder.lineTo(this.point);
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

    public buildPath(builder: PathBuilder): void {
        builder.circleSegmentTo(this.circle, this.angle);
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

    public buildPath(builder: PathBuilder): void {
        builder.cubicBezierTo(this.point, this.control1, this.control2);
    }
}

export class Shape {
    public width: number = 1;
    public height: number = 1;
    public fillColor: string | undefined = undefined;
    public lineColor: string | undefined = undefined;

    private segments: IPathSegment[] = [];

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
        const builder = new PathBuilder();
        this.segments.forEach((segment => {
            segment.buildPath(builder);
        }))
        return builder.path;
    }

    public performLayout(bounds: Box): void {
        const scalingX = bounds.width / this.width;
        const scalingY = bounds.height / this.height;
        this.scale(new Vector(scalingX, scalingY));
        this.translate(bounds.topLeft);
    }
}