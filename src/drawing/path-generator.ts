import { Vector } from "../utils/vector.js";
import { Circle } from "../utils/circle.js";

export class PathGenerator {
    public path: string;

    constructor(start: Vector | Vector[]) {
        if (Array.isArray(start)) {
            this.path = `M ${start[0].x} ${start[0].y}`;
            for (let i = 1; i < start.length; i++) {
                this.lineTo(start[i]);
            }
        } else {
            this.path = `M ${start.x} ${start.y}`;
        }
    }

    public lineTo(point: Vector): void {
        this.path += ` L ${point.x} ${point.y}`;
    }

    public arcTo(point: Vector, radiusX: number, radiusY: number, largeArc: boolean, positiveSweep: boolean): void {
        const la = (largeArc) ? "1" : "0";
        const ps = (positiveSweep) ? "1" : "0";
        this.path += ` A ${radiusX} ${radiusY} ${la} ${ps} ${point.x} ${point.y}`;
    }

    public circleSegmentTo(circle: Circle, angle: number): void {
        const la = "0";
        const ps = "1";
        const point = circle.pointAtAngle(angle);
        this.path += ` A ${circle.radius} ${circle.radius} 0 ${la} ${ps} ${point.x} ${point.y}`;
    }
}