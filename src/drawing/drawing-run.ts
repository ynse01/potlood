import { ShapeBounds } from "./shape-bounds.js";
import { Picture } from "./picture.js";
import { ILayoutable } from "../utils/i-layoutable.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { ChartSpace } from "../chart/chart-space.js";

export class DrawingRun implements ILayoutable {
    public bounds: ShapeBounds;
    public picture: Picture | undefined;
    public chart: ChartSpace | undefined;
    public previousXPos: number | undefined;
    public lastXPos: number | undefined;

    constructor(bounds: ShapeBounds) {
        this.bounds = bounds;
    }

    public getUsedWidth(_availableWidth: number): number {
        return this.bounds.boundSizeX;
    }

    public getHeight(_width: number): number {
        return this.bounds.boundSizeY;
    }

    public performLayout(_flow: VirtualFlow): void {
        // Nothing to do for now.
        this.lastXPos = 0;
    }
}