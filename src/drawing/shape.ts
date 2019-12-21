import { Vector } from "../math/vector.js";
import { PathGenerator } from "./path-generator.js";
import { Box } from "../math/box.js";

interface IPathSegment {
    translate(offset: Vector): void;
    scale(scaling: Vector): void;
    generatePath(generator: PathGenerator): void;
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

    public generatePath(generator: PathGenerator): void {
        generator.moveTo(this.point);
    }
}

class LineTo extends MoveTo {
    public generatePath(generator: PathGenerator): void {
        generator.lineTo(this.point);
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

    public generatePath(generator: PathGenerator): void {
        generator.cubicBezierTo(this.point, this.control1, this.control2);
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

    public addMove(point: Vector): void {
        this.segments.push(new MoveTo(point));
    }

    public addLine(point: Vector): void {
        this.segments.push(new LineTo(point));
    }

    public addCubicBezier(point: Vector, control1: Vector, control2: Vector): void {
        this.segments.push(new CubicBezierTo(point, control1, control2));
    }

    public generatePath(): string {
        const generator = new PathGenerator();
        this.segments.forEach((segment => {
            segment.generatePath(generator);
        }))
        return generator.path;
    }

    public performLayout(bounds: Box): void {
        const scalingX = bounds.width / this.width;
        const scalingY = bounds.height / this.height;
        this.scale(new Vector(scalingX, scalingY));
        this.translate(bounds.topLeft);
    }
}