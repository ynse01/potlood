import { TableColumn } from "./table-column.js";
import { Paragraph } from "../paragraph/paragraph.js";
import { TableStyle } from "./table-style.js";
import { VirtualFlow } from "../utils/virtual-flow.js";

export class TableCell {
    public id: string | undefined = undefined;
    public columns: TableColumn[];
    public rowSpan: number = 1;
    public pars: Paragraph[] = [];
    public style: TableStyle;

    constructor(columns: TableColumn[], style: TableStyle, startIndex: number) {
        this.style = style;
        this.columns = this.getColumns(columns, startIndex);
    }

    public getHeight(): number {
        const width = this.getTextWidth();
        let height = this.style.margins.cellMarginTop + this.style.margins.cellMarginBottom;
        this.pars.forEach(par => {
            height += par.getTextHeight(width);
        });
        return height;
    }

    public getStart(): number {
        return this.columns[0].start;
    }

    public getWidth(): number {
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
        this.pars.forEach(par => {
            par.performLayout(flow);
        })
    }

}
