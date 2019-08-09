import { Style } from "./style.js";
import { Metrics } from "../utils/metrics.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { RunInParagraph } from "../paragraph/paragraph.js";
import { IPositionedTextLine } from "./positioned-text-line.js";
import { ILayoutable } from "../utils/i-layoutable.js";
import { TextFitter } from "./text-fitter.js";

export enum LineInRun {
    Normal = 0,
    FirstLine = 1,
    LastLine = 2,
    OnlyLine = 3
}

export class TextRun implements ILayoutable {
    public text: string;
    public style: Style;
    public inParagraph: RunInParagraph = RunInParagraph.OnlyRun;
    public previousXPos: number | undefined;
    public lastXPos: number | undefined;
    private _lines: IPositionedTextLine[] | undefined = undefined;

    constructor(text: string, style: Style) {
        this.style = style;
        this.text = text;
    }

    public getHeight(width: number): number {
        return this.getLines(width).length * Metrics.getLineSpacing(this.style);
    }

    public getLines(width: number): IPositionedTextLine[] {
        const flow = new VirtualFlow(0, width, 0);
        return this.getFlowLines(flow);
    }

    public performLayout(flow: VirtualFlow): void {
        this.getFlowLines(flow);
    }

    public getFlowLines(flow: VirtualFlow): IPositionedTextLine[] {
        if (this._lines !== undefined) {
            return this._lines;
        }
        let remainder = this.text;
        let lines: IPositionedTextLine[] = [];
        const yDelta = Metrics.getLineSpacing(this.style);
        let inRun = LineInRun.FirstLine;
        while(remainder.length > 0) {
            let usedWidth = 0;
            const line = TextFitter.fitText(remainder, this.style, flow.getWidth());
            if (remainder.length === line.length) {
                // Check for last line of run.
                if (inRun === LineInRun.FirstLine) {
                    inRun = LineInRun.OnlyLine;
                } else {
                    inRun = LineInRun.LastLine;
                }
                this.lastXPos = Metrics.getTextWidth(line, this.style) + this.style.identation;
            }
            const xDelta = (inRun === LineInRun.FirstLine || inRun === LineInRun.OnlyLine) ? this.style.hanging : this.style.identation;
            const x = flow.getX() + xDelta;
            const fitWidth = (inRun !== LineInRun.LastLine && inRun !== LineInRun.OnlyLine);
            const width = flow.getWidth() - xDelta;
            lines.push({text: line, x: x, y: flow.getY(), width: width, fitWidth: fitWidth, inRun: inRun});
            if (usedWidth === 0) {
                flow.advancePosition(yDelta);
            }
            remainder = remainder.substring(line.length);
            inRun = LineInRun.Normal;
        }
        return lines;
    }
}