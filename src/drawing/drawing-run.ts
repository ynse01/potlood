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

    public performLayout(flow: VirtualFlow): void {
        const bounds = this.bounds.rectangle.translate(flow.getX(), flow.getY());
        if (this.picture !== undefined) {
            this.picture.bounds = bounds;
            this.picture.performLayout(flow);
        }
        if (this.chart !== undefined) {
            this.chart.bounds = bounds;
            this.chart.performLayout(flow);
        }
        this.lastXPos = 0;
        if (this.bounds.anchor === "anchor") {
            flow.advancePosition(this.bounds.boundSizeY);
        }
    }
}