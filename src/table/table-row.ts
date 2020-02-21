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
            const cellFlow = cell.getCellFlow(flow);
            cell.performLayout(cellFlow);
            if (cell.style.rowSpan === InSequence.Only) {
                maxY = Math.max(cellFlow.getY(), maxY);
            }
        });
        const maxHeight = maxY - startY;
        // Set the max height as height for all cells.
        this.cells.forEach(cell => {
            if (cell.style.rowSpan === InSequence.Only) {
                cell.bounds!.height = maxHeight;
            }
        });
        this.maxHeight = maxHeight;
        flow.advancePosition(maxHeight);
    }
}
