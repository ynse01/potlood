import { Xml } from "../utils/xml.js";
import { Style } from "./style.js";
import { TextRun } from "./text-run.js";
import { RunStyle } from "./run-style.js";
import { ParStyle } from "../paragraph/par-style.js";
import { NamedStyles } from "./named-styles.js";

export class TextReader {
    public static readTextRun(runNode: ChildNode, parStyle: ParStyle | undefined, namedStyles: NamedStyles | undefined): TextRun {
        const run = new TextRun("", new Style());
        const presentationNode = Xml.getFirstChildOfName(runNode, "w:rPr");
        if (presentationNode !== undefined && presentationNode.hasChildNodes()) {
            run.style.runStyle = RunStyle.fromPresentationNode(presentationNode);
        }
        if (parStyle !== undefined) {
            run.style.parStyle = parStyle;
        }
        const textNode = Xml.getFirstChildOfName(runNode, "w:t");
        if (textNode !== undefined) {
            const text = textNode.textContent;
            if (text !== null) {
                run.text = text;
            }
        }
        run.style.applyNamedStyles(namedStyles);
        return run;
    }
}