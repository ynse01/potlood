import { Shape } from "./shape.js";
import { Xml } from "../utils/xml.js";
import { PresetShapeFactory } from "./preset-shape-factory.js";
import { PointGuide } from "./point-guide.js";

export class ShapeReader {
    private static _presetFactory = new PresetShapeFactory();

    public readShape(shapeNode: Node): Shape | undefined {
        let shape: Shape | undefined = new Shape();
        let fillColor: string | undefined = undefined;
        let lineColor: string | undefined = undefined;
        const presentationNode = Xml.getFirstChildOfName(shapeNode, "wps:spPr");
        if (presentationNode !== undefined) {
            presentationNode.childNodes.forEach(child => {
                switch(child.nodeName) {
                    case "a:custGeom":
                        shape = this._readCustomShape(child);
                        break;
                    case "a:prstGeom":
                        shape = this._readPresetShape(child);
                        break;
                    case "a:solidFill":
                        fillColor = this._readFillColor(child);
                        break;
                    case "a:ln":
                        const firstChild = child.firstChild;
                        if (firstChild !== null) {
                            lineColor = this._readFillColor(child.firstChild!);
                        }
                        break;
                    case "a:noFill":
                        fillColor = undefined;
                        break;
                    case "a:xfrm":
                        // Ignore
                        break;
                    default:
                        console.log(`Don't know how to parse ${child.nodeName} during Shape reading.`);
                        break;
                }
            });
        }
        if (shape !== undefined) {
            shape.lineColor = lineColor;
            shape.fillColor = fillColor;
        }
        return shape;
    }

    public readPath(pathNode: Node, shape: Shape): void {
        let filledIn = true;
        let stroked = true;
        const fill = Xml.getAttribute(pathNode, "fill");
        if (fill !== undefined) {
            filledIn = fill !== "none";
        }
        const stroke = Xml.getAttribute(pathNode, "stroke");
        if (stroke !== undefined) {
            stroked = Xml.attributeAsBoolean(stroke);
        }
        shape.addPath(filledIn, stroked);
        pathNode.childNodes.forEach(segmentNode => {
            if (segmentNode.nodeType === Node.ELEMENT_NODE) {
                switch(segmentNode.nodeName) {
                    case "a:arcTo":
                    case "arcTo":
                        this._addAngle(segmentNode, shape);
                        break;
                    case "a:moveTo":
                    case "moveTo":
                        const movePointNode = Xml.getFirstChildOfName(segmentNode, ["pt", "a:pt"]);
                        if (movePointNode !== undefined) {
                            shape.addSegmentMove(this._readPoint(movePointNode));
                        } else {
                            console.log("Invalid move-to path segment encountered.");
                        }
                        break;
                    case "a:lnTo":
                    case "lnTo":
                        const linePointNode = Xml.getFirstChildOfName(segmentNode, ["pt", "a:pt"]);
                        if (linePointNode !== undefined) {
                            shape.addSegmentLine(this._readPoint(linePointNode));
                        } else {
                            console.log("Invalid line-to path segment encountered.");
                        }
                        break;
                    case "a:cubicBezTo":
                    case "cubicBezTo":
                        this._addCubicBezier(segmentNode, shape);
                        break;
                    case "a:quadBezTo":
                    case "quadBezTo":
                        this._addQuadBezier(segmentNode, shape);
                        break;
                    case "a:close":
                    case "close":
                        shape.addSegmentClose();
                        break;
                    default:
                        console.log(`Unknown path segment ${segmentNode.nodeName} encountered during reading of Shape`);
                        break;
                }
            }
        });
    }

    private _readPresetShape(presetNode: Node): Shape | undefined {
        let shape: Shape | undefined = undefined;
        const name = Xml.getAttribute(presetNode, "prst");
        if (name !== undefined) {
            shape = ShapeReader._presetFactory.createShape(name);
        }
        return shape;
    }

    private _readCustomShape(customNode: Node): Shape | undefined {
        let shape: Shape | undefined = undefined;
        const pathListNode = Xml.getFirstChildOfName(customNode, "a:pathLst");
        if (pathListNode !== undefined) {
            const pathNode = Xml.getFirstChildOfName(pathListNode, "a:path");
            if (pathNode !== undefined) {
                shape = new Shape();
                this.readPath(pathNode, shape);
                const widthAttr = Xml.getAttribute(pathNode, "w");
                if (widthAttr !== undefined) {
                    shape.width = parseInt(widthAttr);
                }
                const heightAttr = Xml.getAttribute(pathNode, "h");
                if (heightAttr !== undefined) {
                    shape.height = parseInt(heightAttr);
                }
            }
        }
        return shape;
    }

    private _readFillColor(fillNode: Node): string | undefined {
        let color: string | undefined = undefined;
        const colorNode = fillNode.firstChild;
        if (colorNode !== null) {
            color = Xml.getStringValue(colorNode);
        }
        return color;
    }

    private _addAngle(segmentNode: Node, shape: Shape): void {
        const sweepAngle = Xml.getAttribute(segmentNode, "swAng");
        const startAngle = Xml.getAttribute(segmentNode, "stAng");
        const radiusX = Xml.getAttribute(segmentNode, "wR");
        const radiusY = Xml.getAttribute(segmentNode, "hR");
        if (sweepAngle !== undefined && startAngle !== undefined && radiusX !== undefined && radiusY !== undefined) {
            shape.addSegmentArc(sweepAngle, startAngle, radiusX, radiusY);
        }
    }

    private _addQuadBezier(segmentNode: Node, shape: Shape): void {
        const childNodes = segmentNode.childNodes;
        if (childNodes.length === 3) {
            const endPoint = this._readPoint(childNodes[1]);
            const control = this._readPoint(childNodes[0]);
            shape.addSegmentQuadBezier(endPoint, control);
        }
    }

    private _addCubicBezier(segmentNode: Node, shape: Shape): void {
        const childNodes = segmentNode.childNodes;
        if (childNodes.length === 3) {
            const endPoint = this._readPoint(childNodes[1]);
            const control1 = this._readPoint(childNodes[0]);
            const control2 = this._readPoint(childNodes[2]);
            shape.addSegmentCubicBezier(endPoint, control1, control2);
        }
    }

    private _readPoint(pointNode: Node): PointGuide {
        let x = "0";
        let y = "0";
        const xAttr = Xml.getAttribute(pointNode, "x");
        const yAttr = Xml.getAttribute(pointNode, "y");
        if (xAttr !== undefined) {
            x = xAttr;
        }
        if (yAttr !== undefined) {
            y = yAttr;
        }
        return new PointGuide(x, y);
    }
}