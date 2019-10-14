import { Xml } from "../utils/xml.js";
import { ChartSpace } from "./chart-space.js";
import { BarChart } from "./bar-chart.js";
import { ChartSeries } from "./chart-series.js";
import { ChartValue } from "./chart-value.js";
import { ChartAxis, ChartAxisPosition, ChartAxisTickMode, ChartAxisLabelAlignment, ChartAxisCrossMode } from "./chart-axis.js";
import { ChartSpaceStyle } from "./chart-space-style.js";
import { Metrics } from "../utils/metrics.js";

export class ChartReader {
    public static readChartFromNode(chartSpaceNode: Node, space: ChartSpace): ChartSpace {
        const chartNode = Xml.getFirstChildOfName(chartSpaceNode, "c:chart");
        if (chartNode !== undefined) {
            const plotAreaNode = Xml.getFirstChildOfName(chartNode, "c:plotArea");
            if (plotAreaNode !== undefined) {
                plotAreaNode.childNodes.forEach(child => {
                    switch(child.nodeName) {
                        case "c:barChart":
                            space.setBarChart(this._readBarChart(child, space));
                            break;
                        case "c:catAx":
                            space.categoryAxis = this._readChartAxis(child);
                            break;
                        case "c:valAx":
                            space.valueAxis = this._readChartAxis(child);
                            break;
                        case "c:spPr":
                            space.style = this._readSpaceStyle(child);
                    }
                });
            }
        }
        return space;
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

    private static _readSpaceStyle(spaceStyleNode: Node): ChartSpaceStyle {
        const style = new ChartSpaceStyle();
        spaceStyleNode.childNodes.forEach(child => {
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

    private static _readChartAxis(axisNode: Node): ChartAxis {
        let pos: ChartAxisPosition = ChartAxisPosition.Bottom;
        let majorTickMode: ChartAxisTickMode = ChartAxisTickMode.None;
        let minorTickMode: ChartAxisTickMode = ChartAxisTickMode.None;
        let labelAlignment: ChartAxisLabelAlignment = ChartAxisLabelAlignment.Center;
        let crossMode: ChartAxisCrossMode = ChartAxisCrossMode.AutoZero;
        let labelOffset = 0;
        axisNode.childNodes.forEach(child => {
            let valAttr: string | undefined = undefined;
            switch (child.nodeName) {
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
        const axis = new ChartAxis(pos, majorTickMode, minorTickMode, labelOffset);
        axis.labelAlignment = labelAlignment;
        axis.crossMode = crossMode;
        return axis;
    }

    private static _readChartSeries(seriesNode: Node): ChartSeries {
        const series = new ChartSeries();
        const catNode = Xml.getFirstChildOfName(seriesNode, "c:cat");
        if (catNode !== undefined) {
            if (catNode.firstChild !== null) {
                const refName = catNode.firstChild.nodeName;
                if (refName === "c:strRef") {
                    const stringCats = this._readStringReference(catNode.firstChild);
                    stringCats.forEach(stringCat => {
                        const cat = new ChartValue();
                        cat.text = stringCat;
                        series.categories.push(cat);
                    });
                } else if (refName === "c:numRef") {
                    const numValues = this._readNumericReference(catNode.firstChild);
                    numValues.forEach(numValue => {
                        const cat = new ChartValue();
                        cat.numeric = numValue;
                        series.categories.push(cat);
                    });
                } else {
                    console.log(`Don't know how to parse Chart Category from node: ${refName}`);
                }
            }
        }
        const valNode = Xml.getFirstChildOfName(seriesNode, "c:val");
        if (valNode !== undefined) {
            if (valNode.firstChild !== null) {
                const refName = valNode.firstChild.nodeName;
                if (refName === "c:strRef") {
                    const stringValues = this._readStringReference(valNode.firstChild);
                    stringValues.forEach(stringValue => {
                        const val = new ChartValue();
                        val.text = stringValue;
                        series.values.push(val);
                    });
                } else if (refName === "c:numRef") {
                    const numValues = this._readNumericReference(valNode.firstChild);
                    numValues.forEach(numValue => {
                        const val = new ChartValue();
                        val.numeric = numValue;
                        series.values.push(val);
                    });
                } else {
                    console.log(`Don't know how to parse Chart Value from node: ${refName}`);
                }
            }
        }
        const chartStyleNode = Xml.getFirstChildOfName(seriesNode, "c:spPr");
        if (chartStyleNode !== undefined) {
            const fillNode = Xml.getFirstChildOfName(chartStyleNode, "a:solidFill");
            if (fillNode !== undefined) {
                const colorNode = Xml.getFirstChildOfName(fillNode, "a:srgbClr");
                if (colorNode !== undefined) {
                    const color = Xml.getAttribute(colorNode, "val");
                    if (color !== undefined) {
                        series.color = color;
                    }
                }
            }
        }
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

    private static _readFillColor(fillNode: Node): string {
        let color = "ffffff";
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