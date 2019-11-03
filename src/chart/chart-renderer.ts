import { BarChart } from "./bar-chart.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { IPainter } from "../painting/i-painter.js";
import { ChartAxisCrossMode } from "./chart-axis.js";
import { ChartSpace } from "./chart-space.js";
import { ShapeBounds } from "../drawing/shape-bounds.js";

export class ChartRenderer {
    private _painter: IPainter;

    constructor(painter: IPainter) {
        this._painter = painter;
    }

    public renderChartSpace(space: ChartSpace, flow: VirtualFlow, bounds: ShapeBounds) {
        if (space.barChart !== undefined) {
            this._renderBarChart(space.barChart, flow, bounds.boundOffsetX, bounds.boundOffsetY, bounds.boundSizeX, bounds.boundSizeY);
        }
    }

    private _renderBarChart(barChart: BarChart, flow: VirtualFlow, xDelta: number, yDelta: number, width: number, height: number): void {
        const bounds = barChart.getValueBounds();
        const seriesSpacing = width / (bounds.numCats * bounds.numSeries);
        const catSpacing = width / bounds.numSeries;
        const flowX = flow.getX() + xDelta;
        const topY = flow.getY() + yDelta;
        const bottomY = topY + height;
        const range = barChart.getValueRange();
        const valueAxis = barChart.space.plotArea.valueAxis;
        if (valueAxis !== undefined && valueAxis.crossMode === ChartAxisCrossMode.AutoZero) {
            range.min = 0;
        }
        for(let i = 0; i < bounds.numCats; i++) {
            for(let j = 0; j < bounds.numValues; j++) {
                for(let k = 0; k < bounds.numSeries; k++) {
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