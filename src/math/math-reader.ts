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
import { FractionObject } from "./fraction-object.js";
import { FractionStyle } from "./fraction-style.js";
import { MatrixStyle, MatrixSpacingRule } from "./matrix-style.js";
import { MatrixObject } from "./matrix-object.js";
import { FunctionStyle } from "./function-style.js";
import { FunctionObject } from "./function-object.js";
import { RadicalStyle } from "./radical-style.js";
import { RadicalObject } from "./radical-object.js";
import { MatrixColumnStyle } from "./matrix-column-style.js";
import { Style } from "../text/style.js";

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
                    style.char = Xml.getStringValue(child) || "";
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
        return new DelimiterObject(elem, style, new Style());
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

    private static _readFractionObject(fracNode: Node): FractionObject {
        let style: FractionStyle = new FractionStyle();
        let numerator: MathObject | undefined = undefined;
        let denumerator: MathObject | undefined = undefined;
        fracNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:fPr":
                    style = this._readFractionStyle(child);
                    break;
                case "m:num":
                    numerator = this._readMathElement(child);
                    break;
                case "m:den":
                    denumerator = this._readMathElement(child);
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Fraction reading.`);
                    break;
            }
        });
        return new FractionObject(numerator, denumerator, style);
    }

    private static _readFractionStyle(presentationNode: Node): FractionStyle {
        const style = new FractionStyle();
        presentationNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:type":
                    style.setType(Xml.getStringValue(child));
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Delimiter style reading.`);
                    break;
            }
        })
        return style;
    }

    private static _readFunctionObject(fracNode: Node): FunctionObject {
        let style = new FunctionStyle();
        let functionName: MathObject | undefined = undefined;
        let elem: MathObject | undefined = undefined;
        fracNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:funcPr":
                    style = this._readFunctionStyle(child);
                    break;
                case "m:fName":
                    functionName = this._readMathElement(child);
                    break;
                case "m:e":
                    elem = this._readMathElement(child);
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Fraction reading.`);
                    break;
            }
        });
        return new FunctionObject(functionName, elem, style);
    }

    private static _readFunctionStyle(presentationNode: Node): FunctionStyle {
        const style = new FunctionStyle();
        presentationNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:ctrlPr":
                    // Ignore for now.
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Delimiter style reading.`);
                    break;
            }
        })
        return style;
    }

    private static _readMatrixObject(matrixNode: Node): MatrixObject {
        let style = new MatrixStyle();
        let rows = new MathObjectList();
        matrixNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:mPr":
                    style = this._readMatrixStyle(child);
                    break;
                case "m:mr":
                    const row = new MathObjectList();
                    child.childNodes.forEach(grandChild => 
                        row.add(this._readMathElement(grandChild))
                    );
                    rows.add(row);
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Fraction reading.`);
                    break;
            }
        });
        return new MatrixObject(rows, style);
    }

    private static _readMatrixStyle(presentationNode: Node): MatrixStyle {
        const style = new MatrixStyle();
        presentationNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:baseJc":
                    style.setJustification(Xml.getStringValue(child));
                    break;
                case "m:plcHide":
                    style.hidePlaceholder = Xml.getBooleanValue(child) || false;
                    break;
                case "m:rSp":
                    style.rowSpacing = Xml.getNumberValue(child) || 1;
                    break;
                case "m:rSpRule":
                    style.rowSpacingRule = this._readMatrixSpacingRule(child);
                    break;
                case "m:cSp":
                    style.columnMinimalWidth = Xml.getNumberValue(child) || 0;
                    break;
                case "m:cGp":
                    style.columnGap = Xml.getNumberValue(child) || 1;
                    break;
                case "m:cGpRule":
                    style.columnGapRule = this._readMatrixSpacingRule(child);
                    break;
                case "m:mcs":
                    style.columnStyles = this._readMatrixColumnStyleList(child);
                    break;
                case "m:ctrlPr":
                    // Ignore for now.
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Delimiter style reading.`);
                    break;
            }
        })
        return style;
    }

    private static _readMatrixSpacingRule(_ruleNode: Node): MatrixSpacingRule {
        return MatrixSpacingRule.Single;
    }

    private static _readMatrixColumnStyleList(columnsNode: Node): MatrixColumnStyle[] {
        const columns: MatrixColumnStyle[] = [];
        columnsNode.childNodes.forEach(child => {
            if (child.nodeName === "m:mc") {
                columns.push(this._readMatrixColumnStyle(child));
            }
        });
        return columns;
    }

    private static _readMatrixColumnStyle(columnNode: Node): MatrixColumnStyle {
        const style = new MatrixColumnStyle();
        columnNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:count":
                    style.count = Xml.getNumberValue(child) || 0;
                    break;
                case "m:mcJc":
                    style.setJustification(Xml.getStringValue(child));
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Matrix Column Style reading.`);
                    break;
            }
        });
        return style;
    }

    private static _readRadicalObject(delNode: Node): RadicalObject {
        let style = new RadicalStyle();
        let degree: MathObject | undefined = undefined;
        let elem: MathObject | undefined = undefined;
        delNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:radPr":
                    style = this._readRadicalStyle(child);
                    break;
                case "m:deg":
                    degree = this._readMathElement(child);
                    break;
                case "m:e":
                    elem = this._readMathElement(child);
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Radical reading.`);
                    break;
            }
        });
        return new RadicalObject(degree, elem, style);
    }

    private static _readRadicalStyle(presentationNode: Node): RadicalStyle {
        const style = new RadicalStyle();
        presentationNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "m:degHide":
                    style.hideDegree = Xml.getBooleanValue(child) || false;
                    break;
                case "m:ctrlPr":
                    // Ignore for now.
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
                case "m:e":
                    objects.add(this._readMathElement(child));
                    break;
                case "m:nary":
                    objects.add(this._readNAryObject(child));
                    break;
                case "m:d":
                    objects.add(this._readDelimiterObject(child));
                    break;
                case "m:r":
                    objects.add(this._readRunObject(child));
                    break;
                case "m:f":
                    objects.add(this._readFractionObject(child));
                    break;
                case "m:m":
                    objects.add(this._readMatrixObject(child));
                    break;
                case "m:func":
                    objects.add(this._readFunctionObject(child));
                    break;
                case "m:rad":
                    objects.add(this._readRadicalObject(child));
                    break;
                case "m:acc":
                case "m:bar":
                case "m:box":
                case "m:borderBox":
                case "m:eqArr":
                case "m:groupChr":
                case "m:limLow":
                case "m:limUpp":
                case "m:phant":
                case "m:sPre":
                case "m:sSub":
                case "m:sSubSup":
                case "m:sSup":
                    console.log(`Math Object ${child.nodeName} not implemented yet`);
                    break;
                default:
                    console.log(`Unknown node ${child.nodeName} encountered during reading of Math Objects`);
                    break;
            }
        });
        return objects;
    }
}