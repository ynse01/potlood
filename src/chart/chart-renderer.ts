import { BarChart } from "./bar-chart.js";
import { IPainter } from "../painting/i-painter.js";
import { ChartSpace, ChartType } from "./chart-space.js";
import { ChartStyle } from "./chart-style.js";
import { Box } from "../utils/box.js";
import { ChartLegend } from "./chart-legend.js";
import { ChartAxis } from "./chart-axis.js";
import { LineChart } from "./line-chart.js";
import { ChartValue } from "./chart-value.js";

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
            if (space.chartType === ChartType.Line) {
                this._renderLineChart(space.chart as LineChart, plotBounds);
            }
        }
    }

    private _renderBorderAndShading(style: ChartStyle, bounds: Box): Box {
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

    private _renderLineChart(lineChart: LineChart, bounds: Box): void {
        const counts = lineChart.getCounts();
        const catSpacing = bounds.width / counts.numSeries;
        const flowX = bounds.x;
        const topY = bounds.y;
        const bottomY = topY + bounds.height;
        const range = lineChart.getValueRange();
        for(let k = 0; k < counts.numSeries; k++) {
            const style = lineChart.getSeriesStyle(k);
            let previousVal = this._normalizeValue(lineChart.getValue(0, k), range);
            for(let i = 1; i < counts.numCats; i++) {
                const val = this._normalizeValue(lineChart.getValue(i, k), range);
                const x1 = flowX + (i - 1) * catSpacing;
                const y1 = bottomY - (bottomY - topY) * previousVal;
                const x2 = flowX + i * catSpacing;
                const y2 = bottomY - (bottomY - topY) * val;
                this._painter.paintLine(x1, y1, x2, y2, style.lineColor || "000000", style.lineThickness);
                previousVal = val;
            }
        }
    }

    private _renderBarChart(barChart: BarChart, bounds: Box): void {
        const counts = barChart.getCounts();
        const seriesSpacing = bounds.width / ((counts.numCats + 1) * (counts.numSeries + 1));
        const catSpacing = bounds.width / (counts.numSeries + 1);
        const flowX = bounds.x + seriesSpacing;
        const topY = bounds.y;
        const bottomY = topY + bounds.height;
        const range = barChart.getValueRange();
        for(let k = 0; k < counts.numSeries; k++) {
            const color = barChart.getSeriesStyle(k).fillColor || "000000";
            for(let i = 0; i < counts.numCats; i++) {
                const val = this._normalizeValue(barChart.getValue(i, k), range);
                const x = flowX + i * catSpacing + k * seriesSpacing;
                const y = bottomY - (bottomY - topY) * val;
                this._painter.paintLine(x, bottomY, x, y, color, seriesSpacing);
            }
        }
    }

    private _normalizeValue(val: ChartValue, range: { max: number, min: number }): number {
        return (val.numeric! - range.min) / (range.max - range.min);
    }
}