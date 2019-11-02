import { TextRun } from "../text/text-run.js";
import { DrawingRun } from "../drawing/drawing-run.js";
import { ILayoutable } from "../utils/i-layoutable.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { ParStyle } from "./par-style.js";
export declare enum ParagraphType {
    Text = 0,
    TableCell = 1,
    Drawing = 2
}
export declare class Paragraph implements ILayoutable {
    type: ParagraphType;
    private _runs;
    private _numberingRun;
    constructor(runs: (TextRun | DrawingRun)[], numberingRun: TextRun | undefined);
    readonly style: ParStyle;
    readonly runs: (TextRun | DrawingRun)[];
    readonly numberingRun: TextRun | undefined;
    getUsedWidth(availableWidth: number): number;
    getHeight(width: number): number;
    performLayout(flow: VirtualFlow): void;
}
