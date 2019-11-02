import { Xml } from "../utils/xml.js";
import { BarChart } from "./bar-chart.js";
import { ChartSeries } from "./chart-series.js";
import { ChartValue } from "./chart-value.js";
import { ChartAxis, ChartAxisPosition, ChartAxisTickMode, ChartAxisLabelAlignment, ChartAxisCrossMode } from "./chart-axis.js";
import { ChartStyle } from "./chart-style.js";
import { Metrics } from "../utils/metrics.js";
import { ChartLegend } from "./chart-legend.js";
export class ChartReader {
    static readChartFromNode(chartSpaceNode, space) {
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
    static _readPlotArea(plotAreaNode, space) {
        plotAreaNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "c:barChart":
                    space.setBarChart(this._readBarChart(child, space));
                    break;
                case "c:catAx":
                    space.plotArea.categoryAxis = this._readChartAxis(child);
                    break;
                case "c:valAx":
                    space.plotArea.valueAxis = this._readChartAxis(child);
                    break;
                case "c:spPr":
                    space.plotArea.style = this._readStyle(child);
                    break;
            }
        });
    }
    static _readLegend(legendNode, space) {
        const legend = new ChartLegend();
        legendNode.childNodes.forEach((child) => {
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
        space.legend = legend;
    }
    static _readBarChart(barChartNode, space) {
        const chart = new BarChart(space);
        barChartNode.childNodes.forEach(child => {
            if (child.nodeName === "c:ser") {
                const series = this._readChartSeries(child);
                chart.series.push(series);
            }
        });
        return chart;
    }
    static _readStyle(styleNode) {
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
    static _readChartAxis(axisNode) {
        let pos = ChartAxisPosition.Bottom;
        let majorTickMode = ChartAxisTickMode.None;
        let minorTickMode = ChartAxisTickMode.None;
        let labelAlignment = ChartAxisLabelAlignment.Center;
        let crossMode = ChartAxisCrossMode.AutoZero;
        let labelOffset = 0;
        axisNode.childNodes.forEach(child => {
            let valAttr = undefined;
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
    static _readChartSeries(seriesNode) {
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
                }
                else if (refName === "c:numRef") {
                    const numValues = this._readNumericReference(catNode.firstChild);
                    numValues.forEach(numValue => {
                        const cat = new ChartValue();
                        cat.numeric = numValue;
                        series.categories.push(cat);
                    });
                }
                else {
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
                }
                else if (refName === "c:numRef") {
                    const numValues = this._readNumericReference(valNode.firstChild);
                    numValues.forEach(numValue => {
                        const val = new ChartValue();
                        val.numeric = numValue;
                        series.values.push(val);
                    });
                }
                else {
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
    static _readStringReference(strRefNode) {
        const ref = [];
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
    static _readNumericReference(numRefNode) {
        const ref = [];
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
    static _readFillColor(fillNode) {
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
    static _parseTickMode(tickAttr) {
        let tickMode = ChartAxisTickMode.None;
        if (tickAttr === "out") {
            tickMode = ChartAxisTickMode.Outwards;
        }
        return tickMode;
    }
    static _parsePosition(posAttr) {
        let posMode = ChartAxisPosition.Bottom;
        switch (posAttr) {
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
    static _parseLabelAlignment(_alignAttr) {
        return ChartAxisLabelAlignment.Center;
    }
    static _parseCrossMode(_crossAttr) {
        return ChartAxisCrossMode.AutoZero;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQtcmVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NoYXJ0L2NoYXJ0LXJlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFdEMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBRSxpQkFBaUIsRUFBRSx1QkFBdUIsRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9ILE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRWhELE1BQU0sT0FBTyxXQUFXO0lBQ2IsTUFBTSxDQUFDLGlCQUFpQixDQUFDLGNBQW9CLEVBQUUsS0FBaUI7UUFDbkUsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLG1CQUFtQixDQUFDLGNBQWMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNyRSxJQUFJLFNBQVMsS0FBSyxTQUFTLEVBQUU7WUFDekIsU0FBUyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ2pDLFFBQVEsS0FBSyxDQUFDLFFBQVEsRUFBRTtvQkFDcEIsS0FBSyxRQUFRO3dCQUNULEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDckMsTUFBTTtvQkFDVixLQUFLLFlBQVk7d0JBQ2IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFL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