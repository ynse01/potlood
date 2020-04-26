import { Paragraph } from "../paragraph/paragraph.js";
import { TableCell } from "./table-cell.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { Table } from "./table.js";
import { InSequence } from "../utils/in-sequence.js";

export class TableRow {
    public table: Table;
    public cells: TableCell[] = [];
    public maxHeight: number | undefined;

    constructor(table: Table) {
        this.table = table;
    }

    public setOrder(order: InSequence) {
        this.cells.forEach(cell => cell.rowOrder = order);
    }

    public getPars(): Paragraph[] {
        const pars: Paragraph[] = [];
        this.cells.forEach(cell => {
            pars.push(...cell.pars);
        });
        return pars;
    }

    public performLayout(flow: VirtualFlow): void {
        let maxHeight = 0;
        this.cells.forEach(cell => {
            cell.performLayout(flow);
            if (cell.style.rowSpanOrder === InSequence.Only) {
                const cellHeight = cell.bounds!.height;
                maxHeight = Math.max(cellHeight, maxHeight);
            }
        });
        // Set the max height as height for all cells.
        this.cells.forEach(cell => {
            if (cell.style.rowSpanOrder === InSequence.Only) {
                cell.bounds!.height = maxHeight;
            }
        });
        this.maxHeight = maxHeight;
        flow.advancePosition(maxHeight);
    }
}
