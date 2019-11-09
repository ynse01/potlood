import { TableColumn } from "./table-column.js";
import { Paragraph } from "../paragraph/paragraph.js";
import { TableStyle } from "./table-style.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { Rectangle } from "../utils/rectangle.js";

export class TableCell {
    public id: string | undefined = undefined;
    public columns: TableColumn[];
    public rowSpan: number = 1;
    public pars: Paragraph[] = [];
    public style: TableStyle;
    public bounds: Rectangle | undefined;

    constructor(columns: TableColumn[], style: TableStyle, startIndex: number) {
        this.style = style;
        this.columns = this.getColumns(columns, startIndex);
    }

    private getHeight(): number {
        let height = this.style.margins.cellMarginTop + this.style.margins.cellMarginBottom;
        const topBorder = this.style.borders.borderTop;
        if (topBorder !== undefined) {
            height += topBorder.size;
        }
        const bottomBorder = this.style.borders.borderBottom;
        if (bottomBorder !== undefined) {
            height += bottomBorder.size;
        }
        this.pars.forEach(par => {
            height += par.getHeight();
        });
        return height;
    }

    private getStart(): number {
        return this.columns[0].start;
    }

    private getWidth(): number {
        let width = 0;
        this.columns.forEach(col => {
            width += col.width;
        });
        return width;
    }

    public getTextWidth(): number {
        return this.getWidth() - this.style.margins.cellMarginStart - this.style.margins.cellMarginEnd;
    }

    private getColumns(columns: TableColumn[], startIndex: number): TableColumn[] {
        const colSpan = this.style.gridSpan;
        return columns.slice(startIndex, startIndex + colSpan);
    }

    public performLayout(flow: VirtualFlow): void {
        const x = flow.getX();
        const y = flow.getY();
        this.pars.forEach(par => {
            par.performLayout(flow);
        });
        this.bounds = new Rectangle(x, y, this.getWidth(), this.getHeight());
    }

    public getCellFlow(flow: VirtualFlow): VirtualFlow {
        const x = flow.getX() + this.getStart();
        return new VirtualFlow(x, x + this.getWidth(), flow.getY());
    }
}
