import { BarChart } from "./bar-chart.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { IPainter } from "../painting/i-painter.js";
import { ChartAxisCrossMode } from "./chart-axis.js";
import { ChartSpace } from "./chart-space.js";
import { ShapeBounds } from "../drawing/shape-bounds.js";
import { ChartStyle } from "./chart-style.js";

export class ChartRenderer {
    private _painter: IPainter;

    constructor(painter: IPainter) {
        this._painter = painter;
    }

    public renderChartSpace(space: ChartSpace, flow: VirtualFlow, bounds: ShapeBounds) {
        const spacePosX = flow.getX() + bounds.boundOffsetX;
        const spacePosY = flow.getY() + bounds.boundOffsetY;
        const spaceWidth = bounds.boundSizeX;
        const spaceHeight = bounds.boundSizeY;
        this._renderBorderAndShading(space.style, spacePosX, spacePosY, spaceWidth, spaceHeight);
        const spacing = this._renderBorderAndShading(space.plotArea.style, spacePosX, spacePosY, spaceWidth, spaceHeight);
        if (space.barChart !== undefined) {
            this._renderBarChart(space.barChart, spacePosX + spacing, spacePosY + spacing, bounds.boundSizeX - 2 * spacing, bounds.boundSizeY - 2 * spacing);
        }
    }

    private _renderBorderAndShading(style: ChartStyle, x: number, y: number, width: number, height: number): number {
        let retValue = 0;
        const xMax = x + width;
        const yMax = y + height;
        const lineColor = style.lineColor;
        if (lineColor !== undefined) {
            const thickness = style.lineThickness;
            this._painter.paintLine(x, y, xMax, y, lineColor, thickness);
            this._painter.paintLine(xMax, y, xMax, yMax, lineColor, thickness);
            this._painter.paintLine(x, yMax, x + width, yMax, lineColor, thickness);
            this._painter.paintLine(x, y, x, yMax, lineColor, thickness);
            retValue = thickness;
        }
        const shading = style.fillColor;
        if (shading !== undefined) {
            const yMid = y + (height / 2);
            this._painter.paintLine(x, yMid, xMax, yMid, shading, height);
        }
        return retValue;
    }

    private _renderBarChart(barChart: BarChart, x: number, y: number, width: number, height: number): void {
        const bounds = barChart.getValueBounds();
        const seriesSpacing = width / ((bounds.numCats + 1) * (bounds.numSeries + 1));
        const catSpacing = width / (bounds.numSeries + 1);
        const flowX = x + seriesSpacing;
        const topY = y;
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