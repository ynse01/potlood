import { Table } from "./table.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { TableCell } from "./table-cell.js";
import { TableStyle } from "./table-style.js";
import { TextRun } from "../text/text-run.js";
import { IPainter } from "../painting/i-painter.js";
import { ParagraphRenderer } from "../paragraph/paragraph-renderer.js";

export class TableRenderer {
    private _parRenderer: ParagraphRenderer;
    private _painter: IPainter;

    constructor(painter: IPainter, paragraphRenderer: ParagraphRenderer) {
        this._painter = painter;
        this._parRenderer = paragraphRenderer;
    }

    public renderTable(table: Table, flow: VirtualFlow): void {
        table.rows.forEach(row => {
          const height = row.getMaxHeight();
          row.cells.forEach(cell => {
            const cellFlow = flow.createCellFlow(cell);
            this.renderCellBorder(cell, table.style, cellFlow, height);
            cell.pars.forEach(par => {
              this._parRenderer.renderParagraph(par, cellFlow.clone().advancePosition(table.style.margins.cellMarginTop));
            });
          });
          flow.advancePosition(height);
        });
      }
    
      private renderCellBorder(cell: TableCell, style: TableStyle, flow: VirtualFlow, height: number): void {
        // TODO: Figure out why this offset is required.
        flow = flow.clone().advancePosition((cell.pars[0].runs[0] as TextRun).style.lineSpacing * 0.75);
        const borders = style.borders;
        const x = flow.getX();
        const y = flow.getY();
        if (borders.borderTop !== undefined) {
            this._painter.paintLine(x, y, x+ cell.getWidth(), y, borders.borderTop.color, borders.borderTop.size);
        }
        if (borders.borderBottom !== undefined) {
            const bottom = y + height;
            this._painter.paintLine(x, bottom, x + cell.getWidth(), bottom, borders.borderBottom.color, borders.borderBottom.size);
        }
        if (borders.borderStart !== undefined) {
            this._painter.paintLine(x, y, x, y + height, borders.borderStart.color, borders.borderStart.size);
        }
        if (borders.borderEnd !== undefined) {
            const end = x + cell.getWidth();
            this._painter.paintLine(end, y, end, y + height, borders.borderEnd.color, borders.borderEnd.size);
        }
      }
    
}