import { Style } from "./style.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { InSequence } from "../utils/in-sequence.js";
import { IPositionedTextLine } from "./positioned-text-line.js";
import { ILayoutable } from "../utils/i-layoutable.js";
export declare class TextRun implements ILayoutable {
    texts: string[];
    style: Style;
    inParagraph: InSequence;
    previousXPos: number | undefined;
    lastXPos: number;
    private _lines;
    constructor(texts: string[], style: Style);
    getUsedWidth(availableWidth: number): number;
    getWidthOfLastLine(availableWidth: number): number;
    getHeight(width: number): number;
    getLines(width: number): IPositionedTextLine[];
    performLayout(flow: VirtualFlow): void;
    getFlowLines(flow: VirtualFlow): IPositionedTextLine[];
}
