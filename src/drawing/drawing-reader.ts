import { WordDocument } from "../word-document.js";
import { DrawingRun } from "./drawing-run.js";
import { ShapeBounds } from "./shape-bounds.js";
import { Xml } from "../utils/xml.js";
import { Picture } from "./picture.js";
import { ChartSpace } from "../chart/chart-space.js";
import { Part } from "../package/part.js";
import { BarChart } from "../chart/bar-chart.js";

export class DrawingReader {
    public static readDrawingRun(drawingNode: ChildNode, doc: WordDocument): DrawingRun {
        let bounds = new ShapeBounds();
        const child = drawingNode.childNodes[0];
        if (child.nodeName === "wp:anchor") {
            bounds = ShapeBounds.fromAnchorNode(child);
        } else if (child.nodeName === "wp:inline") {
            bounds = ShapeBounds.fromInlineNode(child);
        }
        const drawing = new DrawingRun(bounds);
        const graphic = Xml.getFirstChildOfName(child, "a:graphic");
        if (graphic !== undefined) {
            const graphicData = Xml.getFirstChildOfName(graphic, "a:graphicData");
            if (graphicData !== undefined) {
                graphicData.childNodes.forEach(childNode => {
                    if (childNode.nodeName === "pic:pic") {
                        drawing.picture = Picture.fromPicNode(childNode, doc);    
                    }
                    if (childNode.nodeName === "c:chart") {
                        const relationship = Xml.getAttribute(childNode, "r:id");
                        if (relationship !== undefined && doc.relationships !== undefined) {
                            const chartTarget = doc.relationships.getTarget(relationship);
                            drawing.chart = this.readChartFromPart(doc.pack.loadPart(`word/${chartTarget}`));
                        }
                    }
                })
            }
        }
        return drawing;
    }

    private static readChartFromPart(promise: Promise<Part>): ChartSpace {
        const space = new ChartSpace();
        const readingPromise =
            new Promise<void>((resolve, reject) => {
                promise.then(part => {
                    this.readChartFromDocument(part.document, space);
                    resolve();
                }).catch(err => {
                    reject(err);
                })
            });
        space.setPromise(readingPromise);
        return space;
    }

    private static readChartFromDocument(doc: XMLDocument, space: ChartSpace): ChartSpace {
        const chartSpaceNode = doc.getRootNode().firstChild;
        if (chartSpaceNode !== null) {
            return this.readChartFromNode(chartSpaceNode, space);
        } else {
            console.log('Failed to find chart');
            return new ChartSpace();
        }
    }

    private static readChartFromNode(chartSpaceNode: Node, space: ChartSpace): ChartSpace {
        const chartNode = Xml.getFirstChildOfName(chartSpaceNode, "c:chart");
        if (chartNode !== undefined) {
            const plotAreaNode = Xml.getFirstChildOfName(chartNode, "c:plotArea");
            if (plotAreaNode !== undefined) {
                const barChartNode = Xml.getFirstChildOfName(plotAreaNode, "c:barChart");
                if (barChartNode !== undefined) {
                    space.setBarChart(BarChart.fromNode(barChartNode));
                }
            }
        }
        return space;
    }
}