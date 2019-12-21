import { Shape } from "./shape.js";
import { Xml } from "../utils/xml.js";
import { Vector } from "../math/vector.js";
import { PresetShapeFactory } from "./preset-shape-factory.js";

export class ShapeReader {
    private _presetFactory = new PresetShapeFactory();

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

    private _readPresetShape(presetNode: Node): Shape | undefined {
        let shape: Shape | undefined = undefined;
        const name = Xml.getAttribute(presetNode, "prst");
        if (name !== undefined) {
            shape = this._presetFactory.createShape(name);
        }
        return shape;
    }

    private _readCustomShape(customNode: Node): Shape | undefined {
        let shape: Shape | undefined = undefined;
        const pathListNode = Xml.getFirstChildOfName(customNode, "a:pathLst");
        if (pathListNode !== undefined) {
            const pathNode = Xml.getFirstChildOfName(pathListNode, "a:path");
            if (pathNode !== undefined) {
                shape = this._readPath(pathNode);
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

    private _readPath(pathNode: Node): Shape {
        const shape = new Shape();
        pathNode.childNodes.forEach(segmentNode => {
            switch(segmentNode.nodeName) {
                case "a:moveTo":
                    shape.addMove(this._readPoint(segmentNode.firstChild!));
                    break;
                case "a:lnTo":
                    shape.addLine(this._readPoint(segmentNode.firstChild!));
                    break;
                case "a:cubicBezTo":
                    this._addCubicBezier(segmentNode, shape);
                    break;
            }
        });
        return shape;
    }

    private _addCubicBezier(segmentNode: Node, shape: Shape): void {
        const childNodes = segmentNode.childNodes;
        if (childNodes.length === 3) {
            const endPoint = this._readPoint(childNodes[1]);
            const control1 = this._readPoint(childNodes[0]);
            const control2 = this._readPoint(childNodes[2]);
            shape.addCubicBezier(endPoint, control1, control2);
        }
    }

    private _readPoint(pointNode: Node): Vector {
        let x = 0;
        let y = 0;
        const xAttr = Xml.getAttribute(pointNode, "x");
        const yAttr = Xml.getAttribute(pointNode, "y");
        if (xAttr !== undefined) {
            x = parseInt(xAttr);
        }
        if (yAttr !== undefined) {
            y = parseInt(yAttr);
        }
        return new Vector(x, y);
    }
}