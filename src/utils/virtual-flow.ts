import { Metrics } from "./metrics.js";
import { Section } from "../section.js";
import { TableCell } from "../table/table-cell.js";
import { Table } from "../table/table.js";

export class VirtualFlow {
    // private _width: number;
    private _xMin: number;
    private _xMax: number;
    // private _pageHeight: number;
    private _pos: number;

    public static fromSection(section: Section | undefined): VirtualFlow {
        const flow = new VirtualFlow(40, 700 - 40);
        // this._width = content.clientWidth - 2 * 40;
        // this._pageHeight = 400;
        if (section !== undefined) {
            let pageWidth = 700;
            if (section.pageWidth !== undefined) {
                pageWidth = Metrics.convertPointToPixels(section.pageWidth);
            }
            const pageHeight = section.pageHeight;
            if (pageHeight !== undefined) {
                // this._pageHeight = Metrics.convertPointsToPixels(pageHeight);
            }
            const marginLeft = section.marginLeft;
            if (marginLeft !== undefined) {
                flow._xMin = Metrics.convertTwipsToPixels(marginLeft);
            }
            const marginRight = section.marginRight;
            if (marginRight !== undefined) {
                flow._xMax = pageWidth - Metrics.convertTwipsToPixels(marginRight);
            }
        };
        return flow;
    }

    constructor(xMin: number, xMax: number, position: number = 0) {
        this._xMin = xMin;
        this._xMax = xMax;
        this._pos = position;
    }

    public getX(): number {
        return this._xMin;
    }

    public getY(): number {
        return this._pos;
    }

    public getWidth(): number {
        return this._xMax - this._xMin;
    }

    public advancePosition(delta: number): VirtualFlow {
        this._pos += delta;
        return this;
    }

    public createCellFlow(cell: TableCell, table: Table) : VirtualFlow {
        const cellSpacing = table.style.cellSpacing;
        let start = this.getX() + cell.getStart();
        start += cellSpacing;
        start += cell.style.margins.cellMarginStart;
        let width = cell.getWidth();
        width -= cell.style.margins.cellMarginStart
        width -= cell.style.margins.cellMarginEnd;
        width -= 2 * cellSpacing;
        const leftBorder = cell.style.borders.borderStart;
        if (leftBorder !== undefined) {
            const leftBorderSize = leftBorder.size + leftBorder.spacing;
            start += leftBorderSize;
            width -= leftBorderSize;
        }
        const rightBorder = cell.style.borders.borderEnd;
        if (rightBorder !== undefined) {
            const rightBorderSize = rightBorder.size + rightBorder.spacing;
            width -= rightBorderSize;
        }
        const y = this._pos + cellSpacing;
        return new VirtualFlow(start, start + width, y);
    }

    public clone(): VirtualFlow {
        return new VirtualFlow(this._xMin, this._xMax, this._pos);
    }
}