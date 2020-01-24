import { DocumentX } from "../document-x.js";
import { DrawingRun, WrapMode } from "./drawing-run.js";
import { ShapeBounds } from "./shape-bounds.js";
import { Xml } from "../utils/xml.js";
import { Picture } from "./picture.js";
import { ChartSpace } from "../chart/chart-space.js";
import { XmlPart } from "../package/xml-part.js";
import { ChartReader } from "../chart/chart-reader.js";
import { ShapeReader } from "./shape-reader.js";
import { ShapeBoundsReader } from "./shape-bounds-reader.js";

export class DrawingReader {
    private static shapeReader = new ShapeReader();

    public static readDrawingRun(drawingNode: ChildNode, docx: DocumentX): DrawingRun {
        let bounds = new ShapeBounds();
        let wrapMode = WrapMode.None;
        const child = drawingNode.childNodes[0];
        if (child.nodeName === "wp:anchor") {
            bounds = ShapeBoundsReader.fromAnchorNode(child);
            wrapMode = WrapMode.TopAndBottom;
        } else if (child.nodeName === "wp:inline") {
            bounds = ShapeBoundsReader.fromInlineNode(child);
        }
        const drawing = new DrawingRun(bounds, wrapMode);
        const graphic = Xml.getFirstChildOfName(child, "a:graphic");
        if (graphic !== undefined) {
            const graphicData = Xml.getFirstChildOfName(graphic, "a:graphicData");
            if (graphicData !== undefined) {
                this._readGraphicData(drawing, graphicData, docx);
            }
        }
        return drawing;
    }

    private static _readGraphicData(drawing: DrawingRun, graphicData: Node, docx: DocumentX): void {
        graphicData.childNodes.forEach(childNode => {
            switch (childNode.nodeName) {
                case "pic:pic":
                    drawing.picture = Picture.fromPicNode(childNode, docx);
                    break;
                case "c:chart":
                    const relationship = Xml.getAttribute(childNode, "r:id");
                    if (relationship !== undefined && docx.relationships !== undefined) {
                        const chartTarget = docx.relationships.getTarget(relationship);
                        drawing.chart = this.readChartFromPart(docx.pack.loadPartAsXml(`word/${chartTarget}`));
                    }
                    break;
                case "wps:wsp":
                    drawing.shape = this.shapeReader.readShape(childNode);
                    break;
                case "wpg:wgp":
                    this._readGraphicData(drawing, childNode, docx);
                    break;
                default:
                    console.log(`Don't know how to parse ${childNode.nodeName} during Drawing reading.`);
                    break;
            }
        });
    }

    private static readChartFromPart(promise: Promise<XmlPart>): ChartSpace {
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
            return ChartReader.readChartFromNode(chartSpaceNode, space);
        } else {
            console.log('Failed to find chart');
            return new ChartSpace();
        }
    }
}