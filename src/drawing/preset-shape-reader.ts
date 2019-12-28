import { Shape } from "./shape.js";
import { Xml } from "../utils/xml.js";
import { ShapeReader } from "./shape-reader.js";
import { PresetShapeFactory } from "./preset-shape-factory.js";


export class PresetShapeReader {
    private _shapeReader = new ShapeReader();

    public readPresetShapeDefinitions(doc: XMLDocument): void {
        doc.getRootNode().firstChild!.childNodes.forEach((child) => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                this.readPresetShapeDefinition(child);
            }
        });
    }

    public readPresetShapeDefinition(defNode: Node): void {
        if (defNode.nodeType === Node.ELEMENT_NODE) {
            const shape = new Shape();
            defNode.childNodes.forEach(child => {
                switch (child.nodeName) {
                    case "avLst":
                        this._readShapeGuideList(child, shape);
                        break;
                    case "gdLst":
                        this._readShapeGuideList(child, shape);
                        break;
                    case "pathLst":
                        this._readPathList(child, shape);
                        break;
                    case "ahLst":
                    case "rect":
                    case "cxnLst":
                    case "#text":
                        // Ignore, only used for editing shapes.
                        break;
                    default:
                        console.log(`Unknown node ${child.nodeName} encountered during reading of Shape definitions`);
                        break;
                }
            });
            PresetShapeFactory.defineShape(defNode.nodeName, shape);
        }
    }

    private _readShapeGuideList(shapeGuideListNode: Node, shape: Shape): void {
        shapeGuideListNode.childNodes.forEach(child => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                this._readShapeGuide(child, shape);
            }
        });
    }

    private _readShapeGuide(shapeGuideNode: Node, shape: Shape): void {
        const fmla = Xml.getAttribute(shapeGuideNode, "fmla");
        const name = Xml.getAttribute(shapeGuideNode, "name");
        if (fmla !== undefined && name !== undefined) {
            shape.guide.addFormula(fmla, name);
        }
    }

    private _readPathList(pathListNode: Node, shape: Shape): void {
        pathListNode.childNodes.forEach(pathNode => {
            if (pathNode.nodeType === Node.ELEMENT_NODE) {
                this._shapeReader.readPath(pathNode, shape);
            }
        });
    }
}