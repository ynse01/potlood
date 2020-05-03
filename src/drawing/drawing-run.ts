import { ShapeBounds, ShapeAnchorMode } from "./shape-bounds";
import { Picture } from "./picture";
import { VirtualFlow } from "../utils/virtual-flow";
import { ChartSpace } from "../chart/chart-space";
import { Shape } from "./shape";
import { IRun } from "../paragraph/paragraph";
import { Box } from "../utils/geometry/box";

export enum WrapMode {
    None,
    Square,
    Through,
    Tight,
    TopAndBottom
}

export class DrawingRun implements IRun {
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
        return this.bounds.sizeX;
    }

    public getHeight(): number {
        return this.bounds.sizeY;
    }

    public performLayout(flow: VirtualFlow): void {
        const bounds = this.bounds.getBox(flow);
        const isFloating = this.bounds.anchor === ShapeAnchorMode.Floating;
        if (this.picture !== undefined) {
            this.picture.bounds = bounds;
            this.picture.performLayout(flow);
        }
        if (this.chart !== undefined) {
            this.chart.bounds = bounds;
            this.chart.performLayout(flow);
        }
        if (this.shape !== undefined) {
            this.shape.performLayout(bounds);
        }
        this.lastXPos = 0;
        this._addObstacle(flow, bounds, isFloating);
    }

    private _addObstacle(flow: VirtualFlow, bounds: Box, isFloating: boolean): void {
        const box = bounds.clone();
        if (this.wrapping === WrapMode.TopAndBottom) {
            box.width = flow.getWidth();
        }
        flow.addObstacle(box, isFloating);
    }
}