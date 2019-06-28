import { FlowPosition } from "./flow-position.js";
import { Metrics } from "./metrics.js";
import { Section } from "./section.js";
import { TableCell } from "./table.js";

export class VirtualFlow {
    // private _width: number;
    private _xMin: number;
    private _xMax: number;
    // private _pageHeight: number;
    private _usedWidth: { [pos: number]: number} = {};

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

    constructor(xMin: number, xMax: number) {
        this._xMin = xMin;
        this._xMax = xMax;
    }

    public getX(flowPos: FlowPosition): number {
        const used = this._usedWidth[flowPos.flowPosition];
        if (used !== undefined) {
            return this._xMin + used;
        }
        return this._xMin;
    }

    public useWidth(flowPos: FlowPosition, used: number) {
        if (used > 0) {
            this._usedWidth[flowPos.flowPosition] = used;
        }
    }

    public getY(flowPos: FlowPosition): number {
        return flowPos.flowPosition;
    }

    public getWidth(flowPos: FlowPosition): number {
        const used = this._usedWidth[flowPos.flowPosition];
        if (used !== undefined) {
            return this._xMax - this._xMin - used;
        }
        return this._xMax - this._xMin;
    }

    public createCellFlow(pos: FlowPosition, cell: TableCell) : VirtualFlow {
        const start = this.getX(pos) + cell.getStart() + cell.tableStyle.cellMarginStart;
        const width = cell.getWidth();
        return new VirtualFlow(start, start + width);
    }
}