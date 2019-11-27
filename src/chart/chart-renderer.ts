import { BarChart } from "./bar-chart.js";
import { IPainter } from "../painting/i-painter.js";
import { ChartSpace, ChartType } from "./chart-space.js";
import { ChartStyle } from "./chart-style.js";
import { Rectangle } from "../utils/rectangle.js";
import { ChartLegend } from "./chart-legend.js";
import { ChartAxis } from "./chart-axis.js";

export class ChartRenderer {
    private _painter: IPainter;

    constructor(painter: IPainter) {
        this._painter = painter;
    }

    public renderChartSpace(space: ChartSpace) {
        const spaceBounds = space.bounds;
        if (spaceBounds !== undefined) {
            this._renderBorderAndShading(space.style, spaceBounds);
            const plotBounds = this._renderBorderAndShading(space.plotArea.style, space.plotArea.bounds);
            if (space.legend !== undefined) {
                this._renderLegend(space.legend);
            }
            if (space.plotArea.categoryAxis !== undefined) {
                this._renderAxis(space.plotArea.categoryAxis);
            }
            if (space.plotArea.valueAxis !== undefined) {
                this._renderAxis(space.plotArea.valueAxis);
            }
            if (space.chartType === ChartType.Bar) {
                this._renderBarChart(space.chart as BarChart, plotBounds);
            }
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
        return bounds.subtractSpacing(spacing);
    }

    private _renderLegend(legend: ChartLegend): void {
        this._renderBorderAndShading(legend.style, legend.bounds);
        const colors = legend.getColors();
        const widgetSize = legend.widgetSize;
        legend.getLines().forEach((line, index) => {
            const widgetX = line.x - widgetSize - legend.widgetSpacing;
            const widgetY = line.y - 3;
            this._painter.paintLine(widgetX, widgetY, widgetX + widgetSize, widgetY, colors[index], widgetSize);
            this._painter.paintText(line.x, line.y, line.width, line.stretched, line.text, line.color, line.justification!, line.fontFamily, line.fontSize, false, false);
        });
    }

    private _renderAxis(axis: ChartAxis): void {
        if (axis.positionedTexts !== undefined) {
            axis.positionedTexts.forEach(line => {
                this._painter.paintText(line.x, line.y, line.width, line.stretched, line.text, line.color, line.justification!, line.fontFamily, line.fontSize, false, false);
            })
        }
        if (axis.positionedLines !== undefined && axis.style.lineColor !== undefined) {
            const lineColor = axis.style.lineColor;
            const thickness = axis.style.lineThickness;
            axis.positionedLines.forEach(line => {
                this._painter.paintLine(line.x1, line.y1, line.x2, line.y2, lineColor, thickness);
            });
        }
    }

    private _renderBarChart(barChart: BarChart, bounds: Rectangle): void {
        const counts = barChart.getCounts();
        const seriesSpacing = bounds.width / ((counts.numCats + 1) * (counts.numSeries + 1));
        const catSpacing = bounds.width / (counts.numSeries + 1);
        const flowX = bounds.x + seriesSpacing;
        const topY = bounds.y;
        const bottomY = topY + bounds.height;
        const range = barChart.getValueRange();
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