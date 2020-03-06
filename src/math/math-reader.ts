import { Equation } from "./equation.js";
import { MathRun } from "./math-run.js";
import { RunStyle } from "../text/run-style.js";
import { NAryStyle } from "./n-ary-style.js";
import { MathObject, MathObjectList } from "./math-object.js";
import { NAryObject } from "./n-ary-object.js";
import { DelimiterObject } from "./delimiter-object.js";
import { RunObject } from "./run-object.js";
import { DelimiterStyle } from "./delimiter-style.js";
import { Xml } from "../utils/xml.js";

export class MathReader {

    public static fromMathNode(mathNode: Node): MathRun {
        const equation = new Equation(this._readMathElement(mathNode));
        return new MathRun(equation);
    }

    private static _readNAryObject(naryNode: Node): NAryObject {
        let style: NAryStyle = new NAryStyle();
        let sub: MathObject | undefined = undefined;
        let sup: MathObject | undefined = undefined;
        let elem: MathObject | undefined = undefined;
        let grandChild: Node | null = null;
        naryNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:naryPr":
                    style = this._readNAryStyle(child);
                    break;
                case "m:sub":
                    grandChild = child.firstChild;
                    if (grandChild !== null) {
                        sub = this._readMathElement(grandChild);
                    }
                    break;
                case "m:sup":
                    grandChild = child.firstChild;
                    if (grandChild !== null) {
                        sup = this._readMathElement(grandChild);
                    }
                    break;
                case "m:e":
                    elem = this._readMathElement(child);
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during N-Ary Object reading.`);
                    break;
            }
        });
        return new NAryObject(sub, sup, elem, style);
    }

    private static _readNAryStyle(presentationNode: Node): NAryStyle {
        const style = new NAryStyle();
        presentationNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:chr":
                    style.char = child.textContent || "";
                    break;
                case "m:subHide":
                    style.hideSub = Xml.getBooleanValue(child) || false;
                    break;
                case "m:supHide":
                    style.hideSuper = Xml.getBooleanValue(child) || false;
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during N-Ary Style reading.`);
                    break;
            }
        })
        return style;
    }

    private static _readDelimiterObject(delNode: Node): DelimiterObject {
        let style: DelimiterStyle = new DelimiterStyle();
        let elem: MathObject | undefined = undefined;
        delNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:dPr":
                    style = this._readDelimiterStyle(child);
                    break;
                case "m:e":
                    elem = this._readMathElement(child);
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Delimiter reading.`);
                    break;
            }
        });
        return new DelimiterObject(elem, style);
    }

    private static _readDelimiterStyle(presentationNode: Node): DelimiterStyle {
        const style = new DelimiterStyle();
        presentationNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:begChr":
                    style.beginChar = Xml.getStringValue(child) || "";
                    break;
                case "m:endChr":
                    style.endChar = Xml.getStringValue(child) || "";
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Delimiter style reading.`);
                    break;
            }
        })
        return style;
    }

    private static _readRunObject(runNode: Node): RunObject {
        let style: RunStyle | undefined = undefined;
        let text: string = "";
        runNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:t":
                    text = child.textContent || "";
                    break;
                case "w:rPr":
                    style = RunStyle.fromPresentationNode(child);
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Math Run reading.`);
                    break;
            }
        });
        return new RunObject(text, style || new RunStyle());
    }

    private static _readMathElement(node: Node): MathObjectList {
        const objects = new MathObjectList();
        node.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:nary":
                    objects.add(this._readNAryObject(child));
                    break;
                case "m:d":
                    objects.add(this._readDelimiterObject(child));
                    break;
                case "m:r":
                    objects.add(this._readRunObject(child));
                    break;
                default:
                    console.log(`Unknown node ${child.nodeName} encountered during reading of Math Objects`);
                    break;
            }
        });
        return objects;
    }
}