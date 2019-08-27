import { Style } from "./style.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { InSequence } from "../paragraph/in-sequence.js";
import { IPositionedTextLine } from "./positioned-text-line.js";
import { ILayoutable } from "../utils/i-layoutable.js";
import { TextFitter } from "./text-fitter.js";

export class TextRun implements ILayoutable {
    public text: string;
    public style: Style;
    public inParagraph: InSequence = InSequence.Only;
    public previousXPos: number | undefined;
    public lastXPos = 0;
    private _lines: IPositionedTextLine[] | undefined = undefined;

    constructor(text: string, style: Style) {
        this.style = style;
        this.text = text;
    }

    public getHeight(width: number): number {
        return this.getLines(width).length * this.style.lineSpacing;
    }

    public getLines(width: number): IPositionedTextLine[] {
        const flow = new VirtualFlow(0, width, 0);
        return this.getFlowLines(flow);
    }

    public performLayout(flow: VirtualFlow): void {
        if (this._lines === undefined) {
            this._lines = this.getFlowLines(flow);
        }
    }

    public getFlowLines(flow: VirtualFlow): IPositionedTextLine[] {
        const result = TextFitter.getFlowLines(this.text, this.style, this.inParagraph, this.lastXPos, flow);
        this.lastXPos = this.lastXPos;
        return result.lines;
    }
}