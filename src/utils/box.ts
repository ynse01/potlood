import { InSequence } from "./in-sequence.js";

export class Box {
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

    public translate(x: number, y: number): Box {
        return new Box(this.x + x, this.y + y, this.width, this.height);
    }

    public subtractBorder(left: number, top: number, right: number, bottom: number): Box {
        return new Box(this.x + left, this.y + top, this.width - left - right, this.height - top - bottom);
    }

    public subtractSpacing(spacing: number): Box {
        return this.subtractBorder(spacing, spacing, spacing, spacing);
    }

    public includePoint(x: number, y: number): Box {
        const newX = Math.min(this.x, x);
        const newY = Math.min(this.y, y);
        const newWidth = Math.max(this.x + this.width, x + this.width) - newX;
        const newHeight = Math.min(this.y + this.height, y + this.height) - newY;
        return new Box(newX, newY, newWidth, newHeight);
    }

    public placeInRectangle(width: number, height: number, xPos: InSequence, yPos: InSequence): Box {
        let x = 0;
        let y = 0;
        if (xPos === InSequence.Middle) {
            x = this.x + (this.width / 2) - (width / 2);
        } else if (xPos === InSequence.Last) {
            x = this.right - width;
        }
        if (yPos === InSequence.Middle) {
            y = this.y + (this.height / 2) - (height / 2);
        } else if (xPos === InSequence.Last) {
            y = this.bottom - height;
        }
        return new Box(x, y, width, height);
    }

    public toString(): string {
        return `{${this.x}, ${this.y}, ${this.width}, ${this.height}}`;
    }
}