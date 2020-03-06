import { Equation, NAryObject, DelimiterObject, RunObject } from "./equation.js";
import { MathRun } from "./math-run.js";

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

    private static _readNAryObject(_naryNode: Node): NAryObject {
        return new NAryObject();
    }

    private static _readDelimiterObject(_delNode: Node): DelimiterObject {
        return new DelimiterObject();
    }

    private static _readRunObject(_runNode: Node): RunObject {
        return new RunObject();
    }
}