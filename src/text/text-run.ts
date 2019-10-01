import { Style } from "./style.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { InSequence } from "../utils/in-sequence.js";
import { IPositionedTextLine } from "./positioned-text-line.js";
import { ILayoutable } from "../utils/i-layoutable.js";
import { TextFitter } from "./text-fitter.js";
import { Metrics } from "../utils/metrics.js";

export class TextRun implements ILayoutable {
    public texts: string[];
    public style: Style;
    public inParagraph: InSequence = InSequence.Only;
    public previousXPos: number | undefined;
    public lastXPos = 0;
    private _lines: IPositionedTextLine[] | undefined = undefined;

    constructor(texts: string[], style: Style) {
        this.style = style;
        this.texts = texts;
    }

    public getUsedWidth(availableWidth: number): number {
        let usedWidth = 0;
        const lines = this.getLines(availableWidth);
        if (lines.length > 1) {
            usedWidth = availableWidth;
        } else {
            usedWidth = lines[0].width;
        }
        return usedWidth;
    }

    public getWidthOfLastLine(availableWidth: number): number {
        const lines = this.getLines(availableWidth);
        return Metrics.getTextWidth(lines[lines.length - 1].text, this.style);
    }

    public getHeight(width: number): number {
        return this.getLines(width).length * this.style.lineSpacing;
    }

    public getLines(width: number): IPositionedTextLine[] {
        let lines: IPositionedTextLine[];
        if (this._lines !== undefined) {
            lines = this._lines;
        } else {
            const flow = new VirtualFlow(0, width, 0);
            lines = this.getFlowLines(flow);
        }
        return lines;
    }

    public performLayout(flow: VirtualFlow): void {
        if (this._lines === undefined) {
            this._lines = this.getFlowLines(flow);
        }
    }

    public getFlowLines(flow: VirtualFlow): IPositionedTextLine[] {
        let lines: IPositionedTextLine[] = [];
        if (!this.style.invisible) {
            const result = TextFitter.getFlowLines(this, flow);
            this.lastXPos = result.lastXPos;
            lines = result.lines;
        } else {
            this.lastXPos = 0;
        }
        return lines;
    }
}