import { ChartValue } from "./chart-value.js";
import { Xml } from "../utils/xml.js";

export class ChartSeries {
    public categories: ChartValue[] = [];
    public values: ChartValue[][] = [];

    public static fromNode(seriesNode: Node): ChartSeries {
        const series = new ChartSeries();
        const catNode = Xml.getFirstChildOfName(seriesNode, "c:cat");
        if (catNode !== undefined) {
            if (catNode.firstChild !== null) {
                const refName = catNode.firstChild.nodeName;
                if (refName === "c:strRef") {
                    const stringCats = ChartSeries.readStringReference(catNode.firstChild);
                    stringCats.forEach(stringCat => {
                        const cat = new ChartValue();
                        cat.text = stringCat;
                        series.categories.push(cat);
                    });
                } else if (refName === "c:numRef") {
                    const numValues = ChartSeries.readNumericReference(catNode.firstChild);
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
                    const stringValues = ChartSeries.readStringReference(valNode.firstChild);
                    let values: ChartValue[] = [];
                    stringValues.forEach(stringValue => {
                        const val = new ChartValue();
                        val.text = stringValue;
                        values.push(val);
                    });
                    series.values.push(values);
                } else if (refName === "c:numRef") {
                    const numValues = ChartSeries.readNumericReference(valNode.firstChild);
                    let values: ChartValue[] = [];
                    numValues.forEach(numValue => {
                        const val = new ChartValue();
                        val.numeric = numValue;
                        values.push(val);
                    });
                    series.values.push(values);
                } else {
                    console.log(`Don't know how to parse Chart Value from node: ${refName}`);
                }
            }
        }
        return series;
    }

    private static readStringReference(strRefNode: Node): string[] {
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

    private static readNumericReference(numRefNode: Node): number[] {
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
}