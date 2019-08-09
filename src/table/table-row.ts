import { Paragraph } from "../paragraph/paragraph.js";
import { TableCell } from "./table-cell.js";
import { VirtualFlow } from "../utils/virtual-flow.js";

export class TableRow {
    public cells: TableCell[] = [];

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
        this.cells.forEach(cell => {
            cell.performLayout(flow);
        })
    }
}
