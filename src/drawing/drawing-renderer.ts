import { VirtualFlow } from "../utils/virtual-flow.js";
import { DrawingRun } from "./drawing-run.js";
import { IPainter } from "../painting/i-painter.js";
import { ChartRenderer } from "../chart/chart-renderer.js";

export class DrawingRenderer {
    private _painter: IPainter;
    private _chartRenderer: ChartRenderer;

    constructor(painter: IPainter) {
        this._painter = painter;
        this._chartRenderer = new ChartRenderer(this._painter);
    }

    public renderDrawing(drawing: DrawingRun, flow: VirtualFlow) {
        const picture = drawing.picture;
        if (picture !== undefined && picture.bounds !== undefined) {
            const picBounds = picture.bounds;
            this._painter.paintPicture(picBounds.x, picBounds.y, picBounds.width, picBounds.height, picture);
        }
        const chart = drawing.chart;
        if (chart !== undefined) {
            chart.ensureLoaded().then(() => {
                this._chartRenderer.renderChartSpace(chart);
            });
        }
        if (drawing.bounds.anchor === "anchor") {
            flow.advancePosition(drawing.getHeight(flow.getWidth()));
        }
    }
    
}