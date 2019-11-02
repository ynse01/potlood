import { ShapeBounds } from "./shape-bounds.js";
import { Picture } from "./picture.js";
import { ILayoutable } from "../utils/i-layoutable.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { ChartSpace } from "../chart/chart-space.js";
export declare class DrawingRun implements ILayoutable {
    bounds: ShapeBounds;
    picture: Picture | undefined;
    chart: ChartSpace | undefined;
    previousXPos: number | undefined;
    lastXPos: number | undefined;
    constructor(bounds: ShapeBounds);
    getUsedWidth(_availableWidth: number): number;
    getHeight(_width: number): number;
    performLayout(_flow: VirtualFlow): void;
}
