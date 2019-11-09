export class Rectangle {
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public get left(): number {
        return this.x;
    }

    public get top(): number {
        return this.y;
    }

    public get right(): number {
        return this.x + this.width;
    }

    public get bottom(): number {
        return this.y + this.height;
    }

    public translate(x: number, y: number): Rectangle {
        this.x += x;
        this.y += y;
        return this;
    }

    public subtractBorder(left: number, top: number, right: number, bottom: number): Rectangle {
        this.x += left;
        this.y += top;
        this.width -= left + right;
        this.height -= top + bottom;
        return this;
    }

    public subtractSpacing(spacing: number): Rectangle {
        return this.subtractBorder(spacing, spacing, spacing, spacing);
    }

    public clone(): Rectangle {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    public toString(): string {
        return `{${this.x}, ${this.y}, ${this.width}, ${this.height}}`;
    }
}