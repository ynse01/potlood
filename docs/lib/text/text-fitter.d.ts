import { IPositionedTextLine } from "./positioned-text-line.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { TextRun } from "./text-run.js";
export declare class TextFitter {
    static getFlowLines(run: TextRun, flow: VirtualFlow): {
        lines: IPositionedTextLine[];
        lastXPos: number;
    };
}
