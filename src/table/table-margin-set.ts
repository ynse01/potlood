import { Metrics } from "../utils/metrics";

export class TableMarginSet {
    public cellMarginTop: number;
    public cellMarginStart: number;
    public cellMarginBottom: number;
    public cellMarginEnd: number;

    constructor() {
        const defaultHorPadding = Metrics.convertTwipsToPixels(115);
        this.cellMarginBottom = 0;
        this.cellMarginTop = 0;
        this.cellMarginStart = defaultHorPadding;
        this.cellMarginEnd = defaultHorPadding;
    }
}