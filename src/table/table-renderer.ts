import { Table } from "./table.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { TableCell } from "./table-cell.js";
import { TableStyle } from "./table-style.js";
import { IPainter } from "../painting/i-painter.js";
import { ParagraphRenderer } from "../paragraph/paragraph-renderer.js";
import { Borders } from "./borders.js";

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
                const cellFlow = flow.createCellFlow(cell, table);
                this.renderCellShading(cell, cellFlow, height);
                this.renderCellBorder(cell, table.style, cellFlow, height);
                cellFlow.advancePosition(table.style.margins.cellMarginTop);
                cell.pars.forEach(par => {
                    this._parRenderer.renderParagraph(par, cellFlow);
                });
            });
            flow.advancePosition(height);
        });
    }
    
    private renderCellShading(cell: TableCell, flow: VirtualFlow, height: number): void {
        if (cell.style.shading !== "") {
            let x = flow.getX();
            let y = flow.getY();
            let width = cell.getWidth();
            this._painter.paintLine(x, y, x + width, y, cell.style.shading, height);
        }
    }

    private renderCellBorder(cell: TableCell, style: TableStyle, flow: VirtualFlow, height: number): void {
        let outerBorders: Borders | undefined = style.borders;
        const innerBorders = cell.style.borders;
        // Resolve border conflicts
        if (style.cellSpacing === 0 && cell.style.hasBordersDefined) {
            // Disable cell borders defined at table level.
            outerBorders = undefined;
        }
        let x = flow.getX();
        let y = flow.getY();
        let cellWidth = cell.getWidth();
        if (outerBorders !== undefined) {
            if (outerBorders.borderTop !== undefined) {
                this._painter.paintLine(x, y, x + cellWidth, y, outerBorders.borderTop.color, outerBorders.borderTop.size);
            }
            if (outerBorders.borderBottom !== undefined) {
                const bottom = y + height;
                this._painter.paintLine(x, bottom, x + cellWidth, bottom, outerBorders.borderBottom.color, outerBorders.borderBottom.size);
            }
            if (outerBorders.borderStart !== undefined) {
                this._painter.paintLine(x, y, x, y + height, outerBorders.borderStart.color, outerBorders.borderStart.size);
            }
            if (outerBorders.borderEnd !== undefined) {
                const end = x + cellWidth;
                this._painter.paintLine(end, y, end, y + height, outerBorders.borderEnd.color, outerBorders.borderEnd.size);
            }
        }
        if (innerBorders !== undefined) {
            const cellSpacing = style.cellSpacing;
            x += cellSpacing;
            y += cellSpacing;
            cellWidth -= 2 * cellSpacing;
            if (innerBorders.borderTop !== undefined) {
                this._painter.paintLine(x, y, x + cellWidth, y, innerBorders.borderTop.color, innerBorders.borderTop.size);
            }
            if (innerBorders.borderBottom !== undefined) {
                const bottom = y + height;
                this._painter.paintLine(x, bottom, x + cellWidth, bottom, innerBorders.borderBottom.color, innerBorders.borderBottom.size);
            }
            if (innerBorders.borderStart !== undefined) {
                this._painter.paintLine(x, y, x, y + height, innerBorders.borderStart.color, innerBorders.borderStart.size);
            }
            if (innerBorders.borderEnd !== undefined) {
                const end = x + cellWidth;
                this._painter.paintLine(end, y, end, y + height, innerBorders.borderEnd.color, innerBorders.borderEnd.size);
            }
        }
    }
      
}