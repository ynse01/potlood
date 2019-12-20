import { Vector } from "../math/vector.js";
import { Circle } from "../math/circle.js";

export class PathGenerator {
    public path: string;

    constructor(start?: Vector | Vector[]) {
        if (Array.isArray(start)) {
            this.path = `M ${start[0].x} ${start[0].y}`;
            for (let i = 1; i < start.length; i++) {
                this.lineTo(start[i]);
            }
        } else if (start !== undefined) {
            this.path = `M ${start.x} ${start.y}`;
        } else {
            this.path = "";
        }
    }

    public moveTo(point: Vector): void {
        this.path += `M ${point.x} ${point.y}`;
    }

    public lineTo(point: Vector): void {
        this.path += ` L ${point.x} ${point.y}`;
    }

    public circleSegmentTo(circle: Circle, angle: number): void {
        const la = "0";
        const ps = "1";
        const point = circle.pointAtAngle(angle);
        this.path += ` A ${circle.radius} ${circle.radius} 0 ${la} ${ps} ${point.x} ${point.y}`;
    }

    public cubicBezierTo(point: Vector, control1: Vector, control2: Vector): void {
        this.path += ` C ${control1.x} ${control1.y}, ${control2.x} ${control2.y}, ${point.x} ${point.y}`;
    }
}