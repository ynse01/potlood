import { TableBorder } from "./table-border.js";
import { Metrics } from "../utils/metrics.js";

export class BordersAndMargins {
    public borderTop: TableBorder | undefined;
    public borderStart: TableBorder | undefined;
    public borderBottom: TableBorder | undefined;
    public borderEnd: TableBorder | undefined;
    public borderHorizontal: TableBorder | undefined;
    public borderVertical: TableBorder | undefined;
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
}