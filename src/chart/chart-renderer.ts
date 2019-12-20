import { BarChart } from "./bar-chart.js";
import { IPainter } from "../painting/i-painter.js";
import { ChartSpace, ChartType } from "./chart-space.js";
import { ChartStyle } from "./chart-style.js";
import { Box } from "../utils/box.js";
import { ChartLegend } from "./chart-legend.js";
import { ChartAxis } from "./chart-axis.js";
import { LineChart } from "./line-chart.js";
import { ChartValue } from "./chart-value.js";
import { AreaChart } from "./area-chart.js";
import { Vector } from "../utils/vector.js";
import { PathGenerator } from "../drawing/path-generator.js";
import { PieChart } from "./pie-chart.js";
import { Circle } from "../utils/circle.js";

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
            switch(space.chartType) {
                case ChartType.Bar:
                    this._renderBarChart(space.chart as BarChart, plotBounds);
                    break;
                case ChartType.Line:
                    this._renderLineChart(space.chart as LineChart, plotBounds);
                    break;
                case ChartType.Area:
                    this._renderAreaChart(space.chart as AreaChart, plotBounds);
                    break;
                case ChartType.Pie:
                    this._renderPieChart(space.chart as PieChart, plotBounds);
                    break;
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

    private _renderAreaChart(areaChart: AreaChart, bounds: Box): void {
        const counts = areaChart.getCounts();
        const catSpacing = bounds.width / counts.numSeries;
        const flowX = bounds.x;
        const topY = bounds.y;
        const bottomY = topY + bounds.height;
        const range = areaChart.getValueRange();
        // Loop backward, to got correct Z index.
        for(let seriesIndex = counts.numSeries - 1; seriesIndex >= 0; seriesIndex--) {
            const points: Vector[] = [];
            points.push(bounds.bottomLeft);
            const style = areaChart.getSeriesStyle(seriesIndex, 0);
            for(let catIndex = 0; catIndex < counts.numCats; catIndex++) {
                if (style.fillColor === undefined || style.fillColor === "ffffff") {
                    break;
                }
                const val = this._normalizeValue(areaChart.getValue(catIndex, seriesIndex), range);
                const x = flowX + catIndex * catSpacing;
                const y = bottomY - (bottomY - topY) * val;
                points.push(new Vector(x, y));
            }
            points.push(bounds.bottomRight);
            points.push(bounds.bottomLeft);
            const path = new PathGenerator(points).path;
            this._painter.paintPolygon(path, style.fillColor, style.lineColor, style.lineThickness);
        }
    }

    private _renderLineChart(lineChart: LineChart, bounds: Box): void {
        const counts = lineChart.getCounts();
        const catSpacing = bounds.width / counts.numSeries;
        const flowX = bounds.x;
        const topY = bounds.y;
        const bottomY = topY + bounds.height;
        const range = lineChart.getValueRange();
        for(let seriesIndex = 0; seriesIndex < counts.numSeries; seriesIndex++) {
            let previousVal = this._normalizeValue(lineChart.getValue(0, seriesIndex), range);
            for(let catIndex = 1; catIndex < counts.numCats; catIndex++) {
                const style = lineChart.getSeriesStyle(seriesIndex, catIndex);
                const val = this._normalizeValue(lineChart.getValue(catIndex, seriesIndex), range);
                const x1 = flowX + (catIndex - 1) * catSpacing;
                const y1 = bottomY - (bottomY - topY) * previousVal;
                const x2 = flowX + catIndex * catSpacing;
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
        for(let seriesIndex = 0; seriesIndex < counts.numSeries; seriesIndex++) {
            for(let catIndex = 0; catIndex < counts.numCats; catIndex++) {
                const color = barChart.getSeriesStyle(seriesIndex, catIndex).fillColor || "000000";
                const val = this._normalizeValue(barChart.getValue(catIndex, seriesIndex), range);
                const x = flowX + catIndex * catSpacing + seriesIndex * seriesSpacing;
                const y = bottomY - (bottomY - topY) * val;
                this._painter.paintLine(x, bottomY, x, y, color, seriesSpacing);
            }
        }
    }

    private _renderPieChart(pieChart: PieChart, bounds: Box): void {
        const counts = pieChart.getCounts();
        const middle = new Vector(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
        const seriesIndex = 0;
        const range = { min: 0, max: pieChart.getValueSum(seriesIndex)};
        const circle = new Circle(middle, bounds.height / 2);
        let previousAngle = pieChart.startAngle - Math.PI / 2;
        for(let catIndex = 0; catIndex < counts.numCats; catIndex++) {
            const color = pieChart.getSeriesStyle(seriesIndex, catIndex).fillColor || "000000";
            const val = previousAngle + this._normalizeValue(pieChart.getValue(catIndex, seriesIndex), range) * Math.PI * 2;
            const path = new PathGenerator(middle);
            path.lineTo(circle.pointAtAngle(previousAngle));
            path.circleSegmentTo(circle, val);
            path.lineTo(middle);
            this._painter.paintPolygon(path.path, color, undefined, undefined);
            console.log(path.path);
            previousAngle = val;
        }
    }

    private _normalizeValue(val: ChartValue, range: { max: number, min: number }): number {
        return (val.numeric! - range.min) / (range.max - range.min);
    }
}