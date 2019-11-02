import { TextRun } from "./text-run.js";
import { ParStyle } from "../paragraph/par-style.js";
import { NamedStyles } from "./named-styles.js";
export declare class TextReader {
    static readTextRun(runNode: ChildNode, parStyle: ParStyle | undefined, namedStyles: NamedStyles | undefined): TextRun;
    private static _getTexts;
}
