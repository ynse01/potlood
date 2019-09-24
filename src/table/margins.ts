
export class Margins {
    public cellMarginTop: number;
    public cellMarginStart: number;
    public cellMarginBottom: number;
    public cellMarginEnd: number;

    constructor() {
        this.cellMarginBottom = 0;
        this.cellMarginTop = 0;
        this.cellMarginStart = 0;
        this.cellMarginEnd = 0;
    }

    public isZero(): boolean {
        return this.cellMarginBottom === 0 && this.cellMarginTop === 0;
    }
}