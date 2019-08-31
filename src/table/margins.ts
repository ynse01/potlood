import { Metrics } from "../utils/metrics.js";

export class Margins {
    public cellMarginTop: number;
    public cellMarginStart: number;
    public cellMarginBottom: number;
    public cellMarginEnd: number;

    constructor() {
        const defaultMargin = Metrics.convertTwipsToPixels(115);
        this.cellMarginBottom = 0;
        this.cellMarginTop = 0;
        this.cellMarginStart = defaultMargin;
        this.cellMarginEnd = defaultMargin;
    }

    public isZero(): boolean {
        return this.cellMarginBottom === 0 && this.cellMarginTop === 0;
    }
}