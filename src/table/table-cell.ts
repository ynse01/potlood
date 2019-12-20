import { TableColumn } from "./table-column.js";
import { Paragraph } from "../paragraph/paragraph.js";
import { TableStyle } from "./table-style.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { Box } from "../math/box.js";

export class TableCell {
    public id: string | undefined = undefined;
    public columns: TableColumn[];
    public rowSpan: number = 1;
    public pars: Paragraph[] = [];
    public style: TableStyle;
    public bounds: Box | undefined;

    constructor(columns: TableColumn[], style: TableStyle, startIndex: number) {
        this.style = style;
        this.columns = this._getColumns(columns, startIndex);
    }

    public performLayout(flow: VirtualFlow): void {
        const x = flow.getX();
        const y = flow.getY();
        const margins = this.style.margins;
        const borders = this.style.borders;
        flow.advancePosition(margins.cellMarginTop);
        const topBorder = borders.borderTop;
        if (topBorder !== undefined) {
            flow.advancePosition(topBorder.size);
        }
        flow.advanceX(margins.cellMarginStart, margins.cellMarginEnd);
        const startBorder = borders.borderStart;
        const endBorder = borders.borderEnd;
        // TODO: Handle horizontal border also
        if (startBorder !== undefined && endBorder !== undefined) {
            flow.advanceX(startBorder.size, endBorder.size);
        }
        this.pars.forEach(par => {
            par.performLayout(flow);
        });
        flow.advancePosition(margins.cellMarginBottom);
        const bottomBorder = borders.borderBottom;
        if (bottomBorder !== undefined) {
            flow.advancePosition(bottomBorder.size);
        }
        let height = flow.getY() - y;
        this.bounds = new Box(x, y, this._getWidth(), height);
    }

    public getCellFlow(flow: VirtualFlow): VirtualFlow {
        const x = flow.getX() + this.columns[0].start;
        return new VirtualFlow(x, x + this._getWidth(), flow.getY());
    }

    private _getWidth(): number {
        let width = 0;
        this.columns.forEach(col => {
            width += col.width;
        });
        return width;
    }

    private _getColumns(columns: TableColumn[], startIndex: number): TableColumn[] {
        const colSpan = this.style.gridSpan;
        return columns.slice(startIndex, startIndex + colSpan);
    }
}
