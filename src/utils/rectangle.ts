import { Box } from "./box.js";

export class Rectangle {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public rotation: number;

    constructor(x: number, y: number, width: number, height: number, rotation?: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotation = rotation || 0;
    }

    public get xAxis(): { x: number, y: number} {
        const cos = Math.cos(this.rotation);
        const sin = Math.sin(this.rotation);
        return { x: cos, y: sin};
    }

    public get yAxis(): { x: number, y: number} {
        const cos = Math.cos(this.rotation);
        const sin = Math.sin(this.rotation);
        return { x: sin, y: cos};
    }

    public getPosition(xNorm: number, yNorm: number): { x: number, y: number} {
        const xAxis = this.xAxis;
        const yAxis = this.yAxis;
        const xPos = this.x + xAxis.x * xNorm + yAxis.x * yNorm;
        const yPos = this.y + xAxis.y * xNorm + yAxis.y * yNorm;
        return {x: xPos, y: yPos};
    }

    public get bounds(): Box {
        const pos00 = this.getPosition(0, 0);
        const pos10 = this.getPosition(1, 0);
        const pos01 = this.getPosition(0, 1);
        const pos11 = this.getPosition(1, 1);
        let bounds = new Box(pos00.x, pos00.y, 0, 0);
        bounds = bounds.includePoint(pos10.x, pos10.y);
        bounds = bounds.includePoint(pos01.x, pos01.y);
        bounds = bounds.includePoint(pos11.x, pos11.y);
        return bounds;
    }
}