
export class Size {
    public width: number;
    public height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    public addVertical(other: Size, spacing: number = 0): Size {
        const newWidth = Math.max(this.width, other.width);
        const newHeight = this.height + other.height + spacing;
        return new Size(newWidth, newHeight);
    }

    public addHorizontal(other: Size, spacing: number = 0): Size {
        const newWidth = this.width + other.width + spacing;
        const newHeight = Math.max(this.height, other.height);
        return new Size(newWidth, newHeight);
    }

    public clone(): Size {
        return new Size(this.width, this.height);
    }
}