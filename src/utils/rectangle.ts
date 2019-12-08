import { Box } from "./box.js";
import { Vector } from "./vector.js";

export class Rectangle {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public rotation: number;

    public static fromBox(box: Box): Rectangle {
        return new Rectangle(box.top, box.left, box.width, box.height);
    }

    constructor(x: number, y: number, width: number, height: number, rotation?: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotation = rotation || 0;
    }

    public get xAxis(): Vector {
        const cos = Math.cos(this.rotation);
        const sin = Math.sin(this.rotation);
        return new Vector(cos, sin);
    }

    public get yAxis(): Vector {
        const cos = Math.cos(this.rotation);
        const sin = Math.sin(this.rotation);
        return new Vector(sin, cos);
    }

    public getPosition(norm: Vector): Vector {
        const xAxis = this.xAxis;
        const yAxis = this.yAxis;
        const xPos = this.x + xAxis.x * norm.x + yAxis.x * norm.y;
        const yPos = this.y + xAxis.y * norm.x + yAxis.y * norm.y;
        return new Vector(xPos, yPos);
    }

    public get bounds(): Box {
        const pos00 = this.getPosition(new Vector(0, 0));
        const pos10 = this.getPosition(new Vector(1, 0));
        const pos01 = this.getPosition(new Vector(0, 1));
        const pos11 = this.getPosition(new Vector(1, 1));
        let bounds = new Box(pos00.x, pos00.y, 0, 0);
        bounds = bounds.includePoint(pos10.x, pos10.y);
        bounds = bounds.includePoint(pos01.x, pos01.y);
        bounds = bounds.includePoint(pos11.x, pos11.y);
        return bounds;
    }
}