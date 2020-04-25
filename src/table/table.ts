import { Paragraph } from "../paragraph/paragraph.js";
import { DocumentX } from "../document-x.js";
import { TableStyle } from "./table-style.js";
import { TableColumn } from "./table-column.js";
import { TableRow } from "./table-row.js";
import { ILayoutable } from "../utils/i-layoutable.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { InSequence } from "../utils/in-sequence.js";

export class Table implements ILayoutable {
    public columns: TableColumn[];
    public rows: TableRow[];
    public docx: DocumentX;
    public style: TableStyle;

    constructor(docx: DocumentX) {
        this.docx = docx;
        this.columns = [];
        this.rows = [];
        this.style = new TableStyle();
    }

    public getPars(): Paragraph[] {
        const pars: Paragraph[] = [];
        this.rows.forEach(row => {
            pars.push(...row.getPars());
        });
        return pars;
    }

    public getHeight(): number {
        let height = 0;
        this.rows.forEach(row => {
            height += row.maxHeight || 0;
        });
        return height;
    }

    public performLayout(flow: VirtualFlow): void {
        // Update row span
        this.rows.forEach((row, rowIndex) => {
            row.cells.forEach((cell, columnIndex) => {
                if (cell.style.rowSpanOrder === InSequence.First) {
                    this._updateRowSpan(columnIndex, rowIndex);
                }
            });
        });
        this.rows.forEach(row => {
            row.performLayout(flow);
        });
        // Set height of span cells
        this.rows.forEach((row, rowIndex) => {
            row.cells.forEach((cell, cellIndex) => {
                if ((cell.numRowsInSpan > 1) && cell.bounds !== undefined) {
                    cell.bounds.height = this._getHeightOfRowSpan(cellIndex, rowIndex);
                }
            });
        });

    }

    private _updateRowSpan(cellIndex: number, startRowIndex: number): void {
        let numRows = 1;
        for (let i = startRowIndex; i < this.rows.length; i++) {
            const currentRow = this.rows[i + 1];
            if (currentRow === undefined || currentRow.cells[cellIndex].style.rowSpanOrder !== InSequence.Middle) {
                // Past the last row of the span, set previous as last of the span.
                this.rows[i].cells[cellIndex].style.rowSpanOrder = InSequence.Last;
                break;
            }
            currentRow.cells[cellIndex].numRowsInSpan = 0;
            numRows++;
        }
        this.rows[startRowIndex].cells[cellIndex].numRowsInSpan = numRows;
    }

    private _getHeightOfRowSpan(cellIndex: number, startRowIndex: number): number {
        let height = 0;
        const numRows = this.rows[startRowIndex].cells[cellIndex].numRowsInSpan;
        for (let i = 0; i < numRows; i++) {
            height += this.rows[startRowIndex + i].maxHeight || 0;
        }
        return height;
    }
}