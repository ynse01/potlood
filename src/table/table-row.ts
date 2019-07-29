import { Paragraph } from "../paragraph.js";
import { TableCell } from "./table-cell.js";
import { Table } from "./table.js";
import { VirtualFlow } from "../virtual-flow.js";

export class TableRow {
    public cells: TableCell[] = [];

    public static fromTableRowNode(rowNode: ChildNode, table: Table): TableRow {
        const row = new TableRow();
        let colIndex = 0;
        rowNode.childNodes.forEach(cellNode => {
            if (cellNode.nodeName === "w:tc") {
                const cell = TableCell.fromTableCellNode(cellNode, table, colIndex);
                colIndex += cell.columns.length;
                row.cells.push(cell);
            }
        });
        return row;
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
        this.cells.forEach(cell => {
            cell.performLayout(flow);
        })
    }
}
