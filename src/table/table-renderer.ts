import { Table } from "./table.js";
import { TableCell } from "./table-cell.js";
import { TableStyle } from "./table-style.js";
import { IPainter } from "../painting/i-painter.js";
import { ParagraphRenderer } from "../paragraph/paragraph-renderer.js";
import { TableBorderSet } from "./table-border-set.js";

export class TableRenderer {
    private _parRenderer: ParagraphRenderer;
    private _painter: IPainter;

    constructor(painter: IPainter, paragraphRenderer: ParagraphRenderer) {
        this._painter = painter;
        this._parRenderer = paragraphRenderer;
    }

    public renderTable(table: Table): void {
        table.rows.forEach(row => {
            row.cells.forEach(cell => {
                if (cell.numRowsInSpan > 0) {
                    this.renderCellShading(cell);
                    this.renderCellBorder(cell, table.style);
                    // let topPadding = table.style.margins.cellMarginTop;
                    // const topBorder = cell.style.borders.borderTop;
                    // if (topBorder !== undefined) {
                    //    topPadding += topBorder.size;
                    // }
                    // cellFlow.advancePosition(topPadding);
                    cell.pars.forEach(par => {
                        this._parRenderer.renderParagraph(par);
                    });
                }
            });
        });
    }
    
    private renderCellShading(cell: TableCell): void {
        const bounds = cell.bounds;
        if (cell.style.shading !== "" && bounds !== undefined) {
            this._painter.paintLine(bounds.left, bounds.y, bounds.right, bounds.y, cell.style.shading, bounds.height);
        }
    }

    private renderCellBorder(cell: TableCell, style: TableStyle): void {
        let outerBorders: TableBorderSet | undefined = style.borders;
        const innerBorders = cell.style.borders;
        // Resolve border conflicts
        if (style.cellSpacing === 0 && cell.style.hasBordersDefined) {
            // Disable cell borders defined at table level.
            outerBorders = undefined;
        }
        let bounds = cell.bounds;
        if (bounds === undefined) {
            return;
        }
        if (outerBorders !== undefined) {
            if (outerBorders.borderTop !== undefined) {
                this._painter.paintLine(bounds.left, bounds.top, bounds.right, bounds.top, outerBorders.borderTop.color, outerBorders.borderTop.size);
            }
            if (outerBorders.borderBottom !== undefined) {
                this._painter.paintLine(bounds.left, bounds.bottom, bounds.right, bounds.bottom, outerBorders.borderBottom.color, outerBorders.borderBottom.size);
            }
            if (outerBorders.borderStart !== undefined) {
                this._painter.paintLine(bounds.x, bounds.top, bounds.x, bounds.bottom, outerBorders.borderStart.color, outerBorders.borderStart.size);
            }
            if (outerBorders.borderEnd !== undefined) {
                this._painter.paintLine(bounds.right, bounds.top, bounds.right, bounds.bottom, outerBorders.borderEnd.color, outerBorders.borderEnd.size);
            }
        }
        if (innerBorders !== undefined) {
            bounds.subtractSpacing(style.cellSpacing);
            if (innerBorders.borderTop !== undefined) {
                this._painter.paintLine(bounds.left, bounds.top, bounds.right, bounds.top, innerBorders.borderTop.color, innerBorders.borderTop.size);
            }
            if (innerBorders.borderBottom !== undefined) {
                this._painter.paintLine(bounds.left, bounds.bottom, bounds.right, bounds.bottom, innerBorders.borderBottom.color, innerBorders.borderBottom.size);
            }
            if (innerBorders.borderStart !== undefined) {
                this._painter.paintLine(bounds.x, bounds.top, bounds.x, bounds.bottom, innerBorders.borderStart.color, innerBorders.borderStart.size);
            }
            if (innerBorders.borderEnd !== undefined) {
                this._painter.paintLine(bounds.right, bounds.top, bounds.right, bounds.bottom, innerBorders.borderEnd.color, innerBorders.borderEnd.size);
            }
        }
    }
      
}