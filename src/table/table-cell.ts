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
    public rowOrder: InSequence | undefined;
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
        const rowOrder = (this.rowOrder === undefined) ? InSequence.Only : this.rowOrder;
        const columnOrder = this._getColumnOrder();
        this._contentBounds = this.bounds.clone().subtractBordersAndMargins(borders, margins, rowOrder, columnOrder);
        const contentHeight = this._performInnerLayout(this._contentBounds);
        this._contentBounds.height = contentHeight;
        this.bounds = this._contentBounds.addBordersAndMargins(borders, margins, rowOrder, columnOrder);
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

    private _performInnerLayout(bounds: Box): number {
        const cellFlow = new VirtualFlow(bounds.left, bounds.right, bounds.top);
        this.pars.forEach(par => {
            par.performLayout(cellFlow);
        });
        return cellFlow.getMaxY() - bounds.top;
    }

    private _getColumnOrder(): InSequence {
        let order = InSequence.Middle;
        const numAllColumns = this._allColumns.length;
        if (numAllColumns === 1) {
            order = InSequence.Only;
        } else if (this._startColumnIndex === 0) {
            order = InSequence.First;
        } else if (this._startColumnIndex + this.numColumns === numAllColumns) {
            order = InSequence.Last;
        }
        return order;
    }
}
