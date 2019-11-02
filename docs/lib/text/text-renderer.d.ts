import { VirtualFlow } from "../utils/virtual-flow.js";
import { TextRun } from "./text-run.js";
import { IPainter } from "../painting/i-painter.js";
export declare class TextRenderer {
    private _painter;
    constructor(painter: IPainter);
    renderTextRun(run: TextRun, flow: VirtualFlow): void;
    private _renderText;
    private _renderUnderline;
    private _getX;
}
