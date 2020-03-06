import { Equation } from "./equation.js";
import { MathRun } from "./math-run.js";
import { RunStyle } from "../text/run-style.js";
import { NAryStyle } from "./n-ary-style.js";
import { MathObject, MathObjectList } from "./math-object.js";
import { NAryObject } from "./n-ary-object.js";
import { DelimiterObject } from "./delimiter-object.js";
import { RunObject } from "./run-object.js";

export class MathReader {

    public static fromMathNode(mathNode: Node): MathRun {
        const equation = new Equation();
        mathNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:nary":
                    equation.objects.push(this._readNAryObject(child));
                    break;
                case "m:d":
                    equation.objects.push(this._readDelimiterObject(child));
                    break;
                case "m:r":
                    equation.objects.push(this._readRunObject(child));
                    break;
                default:
                    console.log(`Unknown node ${child.nodeName} encountered during reading of Math Objects`);
                    break;
            }
        });
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
                    break;
            }
        });
        return new NAryObject(sub, sup, elem, style);
    }

    private static _readNAryStyle(_presentationNode: Node): NAryStyle {
        return new NAryStyle();
    }

    private static _readDelimiterObject(delNode: Node): DelimiterObject {
        delNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:dPr":
                case "m:e":
                default:
                    break;
            }
        });
        return new DelimiterObject();
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
                    break;
            }
        });
        return new RunObject(text, style || new RunStyle());
    }

    private static _readMathElement(_node: Node): MathObjectList {
        return new MathObjectList();
    }
}