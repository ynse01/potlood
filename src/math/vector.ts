export class Vector {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public translate(offset: Vector): Vector {
        return new Vector(this.x + offset.x, this.y + offset.y);
    }

    public scale(factor: number | Vector): Vector {
        let factor1: number;
        let factor2: number;
        if (factor instanceof Vector) {
            factor1 = factor.x;
            factor2 = factor.y;
        } else {
            factor1 = factor;
            factor2 = factor;
        }
        return new Vector(this.x * factor1, this.y * factor2);
    }
}