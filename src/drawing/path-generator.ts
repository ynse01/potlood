import { Vector } from "../utils/vector.js";

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
}