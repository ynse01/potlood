import { Shape } from "./shape.js";
import { Xml } from "../utils/xml.js";
import { Vector } from "../math/vector.js";

export class ShapeReader {

    public readShape(shapeNode: Node): Shape | undefined {
        let shape: Shape | undefined = undefined;
        const presentationNode = Xml.getFirstChildOfName(shapeNode, "wps:spPr");
        if (presentationNode !== undefined) {
            const customNode = Xml.getFirstChildOfName(presentationNode, "a:custGeom");
            if (customNode !== undefined) {
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
            }
        }
        return shape;
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
            const endPoint = this._readPoint(childNodes[0]);
            const control1 = this._readPoint(childNodes[1]);
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