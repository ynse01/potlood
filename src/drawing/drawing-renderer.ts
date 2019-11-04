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
        const bounds = drawing.bounds.rectangle.translate(flow.getX(), flow.getY());
        const picture = drawing.picture;
        if (picture !== undefined) {
            this._painter.paintPicture(bounds.x, bounds.y, bounds.width, bounds.height, picture);
        }
        const chart = drawing.chart;
        if (chart !== undefined) {
            const chartFlow = flow.clone();
            chart.ensureLoaded().then(() => {
                this._chartRenderer.renderChartSpace(chart, chartFlow, drawing.bounds);
            });
        }
        if (drawing.bounds.anchor === "anchor") {
            flow.advancePosition(drawing.getHeight(flow.getWidth()));
        }
    }
    
}