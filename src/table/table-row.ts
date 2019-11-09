import { Paragraph } from "../paragraph/paragraph.js";
import { TableCell } from "./table-cell.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { Table } from "./table.js";

export class TableRow {
    public table: Table;
    public cells: TableCell[] = [];
    public maxHeight: number | undefined;

    constructor(table: Table) {
        this.table = table;
    }

    public getMaxHeight(): number {
        let height = 0;
        this.cells.forEach(cell => {
            height = Math.max(height, cell.getHeight());
        });
        return height;
    }

    public getPars(): Paragraph[] {
        const pars: Paragraph[] = [];
        this.cells.forEach(cell => {
            pars.push(...cell.pars);
        });
        return pars;
    }

    public performLayout(flow: VirtualFlow): void {
        const startY = flow.getY();
        let maxY = 0;
        this.cells.forEach(cell => {
            const cellFlow = flow.createCellFlow(cell, this.table);
            cell.performLayout(cellFlow);
            maxY = Math.max(cellFlow.getY(), maxY);
        });
        this.maxHeight = maxY - startY;
        flow.advancePosition(this.maxHeight);
    }
}
