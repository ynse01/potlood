import { Xml } from "../utils/xml.js";
import { ChartSpace, ChartType } from "./chart-space.js";
import { BarChart } from "./bar-chart.js";
import { ChartSeries } from "./chart-series.js";
import { ChartValue } from "./chart-value.js";
import { ChartAxis, ChartAxisPosition, ChartAxisTickMode, ChartAxisLabelAlignment, ChartAxisCrossMode } from "./chart-axis.js";
import { ChartStyle } from "./chart-style.js";
import { Metrics } from "../utils/metrics.js";
import { ChartLegend } from "./chart-legend.js";
import { LineChart } from "./line-chart.js";
import { AreaChart } from "./area-chart.js";
import { PieChart } from "./pie-chart.js";

export class ChartReader {
    public static readChartFromNode(chartSpaceNode: Node, space: ChartSpace): ChartSpace {
        const chartNode = Xml.getFirstChildOfName(chartSpaceNode, "c:chart");
        if (chartNode !== undefined) {
            chartNode.childNodes.forEach(child => {
                switch (child.nodeName) {
                    case "c:spPr":
                        space.style = this._readStyle(child);
                        break;
                    case "c:plotArea":
                        this._readPlotArea(child, space);
                        break;
                    case "c:legend":
                        this._readLegend(child, space);
                        break;
                }                
            });
        }
        return space;
    }

    private static _readPlotArea(plotAreaNode: Node, space: ChartSpace): void {
        plotAreaNode.childNodes.forEach(child => {
            switch(child.nodeName) {
                case "c:areaChart":
                    space.setAreaChart(this._readAreaChart(child, space));
                    break;
                case "c:lineChart":
                    space.setLineChart(this._readLineChart(child, space));
                    break;
                case "c:barChart":
                    space.setBarChart(this._readBarChart(child, space));
                    break;
                case "c:pieChart":
                    space.setPieChart(this._readPieChart(child, space));
                    break;
                case "c:catAx":
                    space.plotArea.categoryAxis = this._readChartAxis(child, space, false);
                    break;
                case "c:valAx":
                    space.plotArea.valueAxis = this._readChartAxis(child, space, true);
                    break;
                case "c:spPr":
                    space.plotArea.style = this._readStyle(child);
                    break;
            }
        });
    }

    private static _readLegend(legendNode: Node, space: ChartSpace): void {
        const legend = new ChartLegend(space);
        legendNode.childNodes.forEach((child: ChildNode) => {
            switch (child.nodeName) {
                case "c:spPr":
                    legend.style = this._readStyle(child);
                    break;
                case "c:legendPos":
                    const posAttr = Xml.getAttribute(child, "var");
                    if (posAttr !== undefined) {
                        legend.position = this._parsePosition(posAttr);
                    }
                    break;
                case "c:overlay":
                    const overlay = Xml.getBooleanValueFromNode(child, "var");
                    if (overlay !== undefined) {
                        legend.overlayOnPlot = overlay;
                    }
                    break;
            }
        });
        // Pie chart shows series 0 by default.
        if (space.chartType === ChartType.Pie) {
            legend.onlySeries = 0;
        }
        space.legend = legend;
    }

    private static _readAreaChart(lineChartNode: Node, space: ChartSpace): AreaChart {
        const chart = new AreaChart(space);
        lineChartNode.childNodes.forEach(child => {
            if (child.nodeName === "c:ser") {
                const series = this._readChartSeries(child);
                chart.series.push(series);
            }
        });
        return chart;
    }

    private static _readLineChart(lineChartNode: Node, space: ChartSpace): LineChart {
        const chart = new LineChart(space);
        lineChartNode.childNodes.forEach(child => {
            if (child.nodeName === "c:ser") {
                const series = this._readChartSeries(child);
                chart.series.push(series);
            }
        });
        return chart;
    }

    private static _readBarChart(barChartNode: Node, space: ChartSpace): BarChart {
        const chart = new BarChart(space);
        barChartNode.childNodes.forEach(child => {
            if (child.nodeName === "c:ser") {
                const series = this._readChartSeries(child);
                chart.series.push(series);
            }
        });
        return chart;
    }

    private static _readPieChart(pieChartNode: Node, space: ChartSpace): PieChart {
        const chart = new PieChart(space);
        pieChartNode.childNodes.forEach(child => {
            if (child.nodeName === "c:ser") {
                const series = this._readChartSeries(child);
                chart.series.push(series);
            }
            if (child.nodeName === "c:firstSliceAngle") {
                const angleAttr = Xml.getAttribute(child, "val");
                if (angleAttr !== undefined) {
                    chart.startAngle = parseInt(angleAttr);
                }
            }
        });
        return chart;
    }

    private static _readStyle(styleNode: Node): ChartStyle {
        const style = new ChartStyle();
        styleNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "a:noFill":
                    style.fillColor = undefined;
                    break;
                case "a:solidFill":
                    style.fillColor = this._readFillColor(child);
                    break;
                case "a:ln":
                    const firstChild = child.firstChild;
                    if (firstChild !== null) {
                        style.lineColor = this._readFillColor(firstChild);
                    }
                    break;
            }
        });
        return style;
    }

    private static _readChartAxis(axisNode: Node, space: ChartSpace, isValueAxis: boolean): ChartAxis {
        let pos: ChartAxisPosition = ChartAxisPosition.Bottom;
        let style = new ChartStyle;
        let majorTickMode: ChartAxisTickMode = ChartAxisTickMode.None;
        let minorTickMode: ChartAxisTickMode = ChartAxisTickMode.None;
        let majorGridStyle = new ChartStyle();
        let minorGridStyle = new ChartStyle();
        let labelAlignment: ChartAxisLabelAlignment = ChartAxisLabelAlignment.Center;
        let crossMode: ChartAxisCrossMode = ChartAxisCrossMode.AutoZero;
        let labelOffset = 0;
        axisNode.childNodes.forEach(child => {
            let valAttr: string | undefined = undefined;
            switch (child.nodeName) {
                case "c:spPr":
                    style = this._readStyle(child);
                    break;
                case "c:majorTickMark":
                    valAttr = Xml.getAttribute(child, "val");
                    if (valAttr !== undefined) {
                        majorTickMode = this._parseTickMode(valAttr);
                    }
                    break;
                case "c:minorTickMark":
                    valAttr = Xml.getAttribute(child, "val");
                    if (valAttr !== undefined) {
                        minorTickMode = this._parseTickMode(valAttr);
                    }
                    break;
                case "c:majorGridlines":
                    if (child.firstChild !== null) {
                        majorGridStyle = this._readStyle(child.firstChild);
                    }
                    break;
                case "c:minorGridlines":
                    if (child.firstChild !== null) {
                        minorGridStyle = this._readStyle(child.firstChild);
                    }
                    break;
                case "c:axPos":
                    valAttr = Xml.getAttribute(child, "val");
                    if (valAttr !== undefined) {
                        pos = this._parsePosition(valAttr);
                    }
                    break;
                case "c:lblAlgn":
                    valAttr = Xml.getAttribute(child, "val");
                    if (valAttr !== undefined) {
                        labelAlignment = this._parseLabelAlignment(valAttr);
                    }
                    break;
                case "c:lblOffset":
                    valAttr = Xml.getAttribute(child, "val");
                    if (valAttr !== undefined) {
                        labelOffset = Metrics.convertTwipsToPixels(parseInt(valAttr, 10));
                    }
                    break;
                case "c:crosses":
                    valAttr = Xml.getAttribute(child, "val");
                    if (valAttr !== undefined) {
                        crossMode = this._parseCrossMode(valAttr);
                    }
                    break;
            }
        });
        const axis = new ChartAxis(space, style, pos, majorTickMode, minorTickMode, labelOffset, isValueAxis);
        axis.labelAlignment = labelAlignment;
        axis.crossMode = crossMode;
        axis.majorGridStyle = majorGridStyle;
        axis.minorGridStyle = minorGridStyle;
        return axis;
    }

    private static _readChartSeries(seriesNode: Node): ChartSeries {
        const series = new ChartSeries();
        seriesNode.childNodes.forEach((child) => {
            const firstChild = child.firstChild;
            switch(child.nodeName) {
                case "c:tx":
                    if (firstChild !== null) {
                        const names = this._readStringReference(firstChild);
                        series.name = names[0];
                    }        
                    break;
                case "c:cat":
                    if (firstChild !== null) {
                        const refName = firstChild.nodeName;
                        if (refName === "c:strRef") {
                            const stringCats = this._readStringReference(firstChild);
                            stringCats.forEach(stringCat => {
                                const cat = new ChartValue();
                                cat.text = stringCat;
                                series.categories.push(cat);
                            });
                        } else if (refName === "c:numRef") {
                            const numValues = this._readNumericReference(firstChild);
                            numValues.forEach(numValue => {
                                const cat = new ChartValue();
                                cat.numeric = numValue;
                                series.categories.push(cat);
                            });
                        } else {
                            console.log(`Don't know how to parse Chart Category from node: ${refName}`);
                        }
                    }
                    break;
                case "c:val":
                    if (firstChild !== null) {
                        const refName = firstChild.nodeName;
                        if (refName === "c:strRef") {
                            const stringValues = this._readStringReference(firstChild);
                            stringValues.forEach(stringValue => {
                                const val = new ChartValue();
                                val.text = stringValue;
                                series.values.push(val);
                            });
                        } else if (refName === "c:numRef") {
                            const numValues = this._readNumericReference(firstChild);
                            numValues.forEach(numValue => {
                                const val = new ChartValue();
                                val.numeric = numValue;
                                series.values.push(val);
                            });
                        } else {
                            console.log(`Don't know how to parse Chart Value from node: ${refName}`);
                        }
                    }
                    break;
                case "c:spPr":
                    series.style = this._readStyle(child);
                    break;
                case "c:dPt":
                    const index = Xml.getNumberValueFromNode(child, "c:idx");
                    const styleNode = Xml.getFirstChildOfName(child, "c:spPr");
                    if (index !== undefined && styleNode !== undefined) {
                        series.categories[index].style = this._readStyle(styleNode);
                    }
                        break;
            }
        });
        return series;
    }

    private static _readStringReference(strRefNode: Node): string[] {
        const ref: string[] = [];
        const strCacheNode = Xml.getFirstChildOfName(strRefNode, "c:strCache");
        if (strCacheNode !== undefined) {
            strCacheNode.childNodes.forEach(node => {
                if (node.nodeName === "c:pt") {
                    const index = Xml.getAttribute(node, "idx");
                    const valueNode = Xml.getFirstChildOfName(node, "c:v");
                    if (index !== undefined && valueNode !== undefined && valueNode.textContent !== null) {
                        ref[parseInt(index, 10)] = valueNode.textContent;
                    }
                }
            });
        }
        return ref;
        
    }

    private static _readNumericReference(numRefNode: Node): number[] {
        const ref: number[] = [];
        const numCacheNode = Xml.getFirstChildOfName(numRefNode, "c:numCache");
        if (numCacheNode !== undefined) {
            numCacheNode.childNodes.forEach(node => {
                if (node.nodeName === "c:pt") {
                    const index = Xml.getAttribute(node, "idx");
                    const valueNode = Xml.getFirstChildOfName(node, "c:v");
                    if (index !== undefined && valueNode !== undefined && valueNode.textContent !== null) {
                        ref[parseInt(index, 10)] = parseFloat(valueNode.textContent);
                    }
                }
            });
        }
        return ref;
    }

    private static _readFillColor(fillNode: Node): string | undefined {
        let color: string | undefined = undefined;
        const colorNode = fillNode.firstChild;
        if (colorNode !== null && colorNode.nodeName === "a:srgbClr") {
            const valAttr = Xml.getAttribute(colorNode, "val");
            if (valAttr !== undefined) {
                color = valAttr;
            }
        }
        return color;
    }

    private static _parseTickMode(tickAttr: string): ChartAxisTickMode {
        let tickMode = ChartAxisTickMode.None;
        if (tickAttr === "out") {
            tickMode = ChartAxisTickMode.Outwards
        }
        return tickMode;
    }

    private static _parsePosition(posAttr: string): ChartAxisPosition {
        let posMode = ChartAxisPosition.Bottom;
        switch(posAttr) {
            case "t":
                posMode = ChartAxisPosition.Top;
                break;
            case "b":
                posMode = ChartAxisPosition.Bottom;
                break;
            case "l":
                posMode = ChartAxisPosition.Left;
                break;
            case "r":
                posMode = ChartAxisPosition.Right;
                break;
        }
        return posMode;
    }

    private static _parseLabelAlignment(_alignAttr: string): ChartAxisLabelAlignment {
        return ChartAxisLabelAlignment.Center;
    }

    private static _parseCrossMode(_crossAttr: string): ChartAxisCrossMode {
        return ChartAxisCrossMode.AutoZero;
    }
}