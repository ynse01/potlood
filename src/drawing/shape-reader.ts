import { Shape } from "./shape.js";
import { Xml } from "../utils/xml.js";
import { Vector } from "../math/vector.js";
import { PathGenerator } from "./path-generator.js";
import { Box } from "../math/box.js";

export class ShapeReader {

    public readShape(shapeNode: Node, bounds: Box): Shape | undefined {
        let shape: Shape | undefined = undefined;
        const presentationNode = Xml.getFirstChildOfName(shapeNode, "wps:spPr");
        if (presentationNode !== undefined) {
            const customNode = Xml.getFirstChildOfName(presentationNode, "a:custGeom");
            if (customNode !== undefined) {
                const pathListNode = Xml.getFirstChildOfName(customNode, "a:pathLst");
                if (pathListNode !== undefined) {
                    const pathNode = Xml.getFirstChildOfName(pathListNode, "a:path");
                    if (pathNode !== undefined){
                        const customPath = this._readPath(pathNode, bounds);
                        shape = new Shape(customPath);
                    }
                }
            }
        }
        return shape;
    }

    private _readPath(pathNode: Node, bounds: Box): string {
        const generator = new PathGenerator();
        const offset = bounds.topLeft;
        const scaling = this._getScaling(pathNode, bounds);
        pathNode.childNodes.forEach(segmentNode => {
            switch(segmentNode.nodeName) {
                case "a:moveTo":
                    generator.moveTo(this._readPoint(segmentNode.firstChild!, offset, scaling));
                    break;
                case "a:lineTo":
                    generator.lineTo(this._readPoint(segmentNode.firstChild!, offset, scaling));
                    break;
                case "a:cubicBezTo":
                    this._addCubicBezier(segmentNode, offset, scaling, generator);
                    break;
            }
        });
        return generator.path;
    }

    private _getScaling(pathNode: Node, bounds: Box): Vector {
        let scaling = new Vector(1, 1);
        const pathWidth = Xml.getAttribute(pathNode, "w");
        const pathHeight = Xml.getAttribute(pathNode, "h");
        if (pathWidth !== undefined && pathHeight !== undefined) {
            const xScale = bounds.width / parseInt(pathWidth);
            const yScale = bounds.width / parseInt(pathHeight);
            scaling = new Vector(xScale, yScale);
        }
        return scaling;
    }

    private _addCubicBezier(segmentNode: Node, offset: Vector, scaling: Vector, generator: PathGenerator): void {
        const childNodes = segmentNode.childNodes;
        if (childNodes.length === 3) {
            const endPoint = this._readPoint(childNodes[0], offset, scaling);
            const control1 = this._readPoint(childNodes[1], offset, scaling);
            const control2 = this._readPoint(childNodes[2], offset, scaling);
            generator.cubicBezierTo(endPoint, control1, control2);
        }
    }

    private _readPoint(pointNode: Node, offset: Vector, scaling: Vector): Vector {
        let x = 0;
        let y = 0;
        const xAttr = Xml.getAttribute(pointNode, "x");
        const yAttr = Xml.getAttribute(pointNode, "y");
        if (xAttr !== undefined) {
            x = parseInt(xAttr) * scaling.x;
        }
        if (yAttr !== undefined) {
            y = parseInt(yAttr) * scaling.y;
        }
        return new Vector(offset.x + x, offset.y + y);
    }
}