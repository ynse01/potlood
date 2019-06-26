import { WordDocument } from "./word-document.js";
import { FlowPosition } from "./flow-position.js";
import { Metrics } from "./metrics.js";

export class VirtualFlow {
    // private _width: number;
    private _pageWidth: number;
    // private _pageHeight: number;
    private _usedWidth: { [pos: number]: number} = {};

    constructor(_content: Element, doc: WordDocument) {
        // this._width = content.clientWidth - 2 * 40;
        this._pageWidth = 700;
        // this._pageHeight = 400;
        if (doc.section !== undefined) {
            const pageWidth = doc.section.pageWidth;
            if (pageWidth !== undefined) {
                this._pageWidth = Metrics.convertPointToPixels(pageWidth) * 2.2;
            }
            const pageHeight = doc.section.pageHeight;
            if (pageHeight !== undefined) {
                // this._pageHeight = Metrics.convertPointsToPixels(pageHeight) * 2.2;
            }
        };
    }

    public getX(flowPos: FlowPosition): number {
        const used = this._usedWidth[flowPos.flowPosition];
        if (used !== undefined) {
            return 40 + used;
        }
        return 40;
    }

    public useWidth(flowPos: FlowPosition, used: number) {
        this._usedWidth[flowPos.flowPosition] = used;
    }

    public getY(flowPos: FlowPosition): number {
        return flowPos.flowPosition;
    }

    public getWidth(flowPos: FlowPosition): number {
        const used = this._usedWidth[flowPos.flowPosition];
        if (used !== undefined) {
            return this._pageWidth - used;
        }
        return this._pageWidth;
    }
}