export class Point {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public static difference(startPoint: Point, endPoint: Point): Point {
        return new Point(startPoint.x - endPoint.x, startPoint.y - endPoint.y);
    }

    public translate(offset: Point): Point {
        return new Point(this.x + offset.x, this.y + offset.y);
    }

    public scale(factor: number | Point): Point {
        let factor1: number;
        let factor2: number;
        if (factor instanceof Point) {
            factor1 = factor.x;
            factor2 = factor.y;
        } else {
            factor1 = factor;
            factor2 = factor;
        }
        return new Point(this.x * factor1, this.y * factor2);
    }

    public clone(): Point {
        return new Point(this.x, this.y);
    }
}