export class Vector {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public scale(factor: number): Vector {
        return new Vector(this.x * factor, this.y * factor);
    }
}