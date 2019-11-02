import { VirtualFlow } from "../utils/virtual-flow.js";
import { DrawingRun } from "./drawing-run.js";
import { IPainter } from "../painting/i-painter.js";
export declare class DrawingRenderer {
    private _painter;
    private _chartRenderer;
    constructor(painter: IPainter);
    renderDrawing(drawing: DrawingRun, flow: VirtualFlow): void;
}
