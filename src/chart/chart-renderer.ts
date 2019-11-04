import { BarChart } from "./bar-chart.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { IPainter } from "../painting/i-painter.js";
import { ChartAxisCrossMode } from "./chart-axis.js";
import { ChartSpace } from "./chart-space.js";
import { ShapeBounds } from "../drawing/shape-bounds.js";
import { ChartStyle } from "./chart-style.js";
import { Rectangle } from "../utils/rectangle.js";

export class ChartRenderer {
    private _painter: IPainter;

    constructor(painter: IPainter) {
        this._painter = painter;
    }

    public renderChartSpace(space: ChartSpace, flow: VirtualFlow, bounds: ShapeBounds) {
        const spaceBounds = bounds.rectangle.translate(flow.getX(), flow.getY());
        this._renderBorderAndShading(space.style, spaceBounds);
        const plotBounds = this._renderBorderAndShading(space.plotArea.style, spaceBounds);
        if (space.barChart !== undefined) {
            this._renderBarChart(space.barChart, plotBounds);
        }
    }

    private _renderBorderAndShading(style: ChartStyle, bounds: Rectangle): Rectangle {
        let spacing = 0;
        const x = bounds.left;
        const y = bounds.top;
        const xMax = bounds.right;
        const yMax = bounds.bottom;
        const lineColor = style.lineColor;
        if (lineColor !== undefined) {
            const thickness = style.lineThickness;
            this._painter.paintLine(x, y, xMax, y, lineColor, thickness);
            this._painter.paintLine(xMax, y, xMax, yMax, lineColor, thickness);
            this._painter.paintLine(x, yMax, xMax, yMax, lineColor, thickness);
            this._painter.paintLine(x, y, x, yMax, lineColor, thickness);
            spacing = thickness;
        }
        const shading = style.fillColor;
        if (shading !== undefined) {
            const yMid = y + (bounds.height / 2);
            this._painter.paintLine(x, yMid, xMax, yMid, shading, bounds.height);
        }
        return bounds.clone().subtractSpacing(spacing);
    }

    private _renderBarChart(barChart: BarChart, bounds: Rectangle): void {
        const counts = barChart.getCounts();
        const seriesSpacing = bounds.width / ((counts.numCats + 1) * (counts.numSeries + 1));
        const catSpacing = bounds.width / (counts.numSeries + 1);
        const flowX = bounds.x + seriesSpacing;
        const topY = bounds.y;
        const bottomY = topY + bounds.height;
        const range = barChart.getValueRange();
        const valueAxis = barChart.space.plotArea.valueAxis;
        if (valueAxis !== undefined && valueAxis.crossMode === ChartAxisCrossMode.AutoZero) {
            range.min = 0;
        }
        for(let i = 0; i < counts.numCats; i++) {
            for(let j = 0; j < counts.numValues; j++) {
                for(let k = 0; k < counts.numSeries; k++) {
                    const val = barChart.getValue(i, k);
                    const normalizedValue = (val.numeric! - range.min) / (range.max - range.min);
                    const color = barChart.getColor(k);
                    const x = flowX + i * catSpacing + k * seriesSpacing;
                    const y = bottomY - (bottomY - topY) * normalizedValue;
                    this._painter.paintLine(x, bottomY, x, y, color, seriesSpacing);
                }
            }
        }
    }
}