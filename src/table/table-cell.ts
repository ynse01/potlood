import { TableColumn } from "./table-column.js";
import { Paragraph } from "../paragraph/paragraph.js";
import { TableStyle } from "./table-style.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { Box } from "../utils/geometry/box.js";
import { InSequence } from "../utils/in-sequence.js";

export class TableCell {
    public id: string | undefined = undefined;
    public pars: Paragraph[] = [];
    public style: TableStyle;
    public bounds: Box | undefined;
    public numRowsInSpan: number = 1;
    private _allColumns: TableColumn[];
    private _startColumnIndex: number;
    private _columns: TableColumn[] | undefined = undefined;
    private _contentBounds: Box | undefined;

    constructor(columns: TableColumn[], style: TableStyle, startColumnIndex: number) {
        this.style = style;
        this._allColumns = columns;
        this._startColumnIndex = startColumnIndex;
    }

    public performLayout(flow: VirtualFlow): void {
        const x = flow.getX() + this._getColumns()[0].start;
        const y = flow.getY();
        const margins = this.style.margins;
        const borders = this.style.borders;
        this.bounds = new Box(x, y, this._getWidth(), 0);
        this._contentBounds = this.bounds.clone().subtractBordersAndMargins(borders, margins, InSequence.Middle, InSequence.Middle);
        const contentHeight = this._performInnerLayout();
        this._contentBounds.height = contentHeight;
        this.bounds = this._contentBounds.addBordersAndMargins(borders, margins, InSequence.Middle, InSequence.Middle);
    }

    public get numColumns(): number {
        return this._getColumns().length;
    }

    private _getColumns(): TableColumn[] {
        if (this._columns === undefined) {
            const columnSpan = this.style.columnSpan;
            this._columns = this._allColumns.slice(this._startColumnIndex, this._startColumnIndex + columnSpan);
        }
        return this._columns;
    }

    private _getWidth(): number {
        let width = 0;
        this._getColumns().forEach(col => {
            width += col.width;
        });
        return width;
    }

    private _performInnerLayout(): number {
        const bounds = this._contentBounds!;
        const cellFlow = new VirtualFlow(bounds.left, bounds.right, bounds.top);
        this.pars.forEach(par => {
            par.performLayout(cellFlow);
        });
        return cellFlow.getMaxY() - bounds.top;
    }
}
