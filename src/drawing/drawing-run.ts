import { ShapeBounds } from "./shape-bounds.js";
import { Picture } from "./picture.js";
import { ILayoutable } from "../utils/i-layoutable.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { ChartSpace } from "../chart/chart-space.js";
import { Shape } from "./shape.js";

export enum WrapMode {
    None,
    Inline,
    Square,
    Through,
    Tight,
    TopAndBottom
}

export class DrawingRun implements ILayoutable {
    public bounds: ShapeBounds;
    public wrapping: WrapMode;
    public picture: Picture | undefined;
    public chart: ChartSpace | undefined;
    public shape: Shape | undefined;
    public previousXPos: number | undefined;
    public lastXPos: number | undefined;

    constructor(bounds: ShapeBounds, wrapping: WrapMode) {
        this.bounds = bounds;
        this.wrapping = wrapping;
    }

    public getUsedWidth(): number {
        return this.bounds.boundSizeX;
    }

    public getHeight(): number {
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
        if ((bounds.width > 400) || (this.wrapping !== WrapMode.Inline && this.wrapping !== WrapMode.None)) {
            flow.advancePosition(this.bounds.boundSizeY);
        }
    }
}