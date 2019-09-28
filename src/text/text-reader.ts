import { Xml } from "../utils/xml.js";
import { Style } from "./style.js";
import { TextRun } from "./text-run.js";
import { RunStyle } from "./run-style.js";
import { ParStyle } from "../paragraph/par-style.js";
import { NamedStyles } from "./named-styles.js";

export class TextReader {
    public static readTextRun(runNode: ChildNode, parStyle: ParStyle | undefined, namedStyles: NamedStyles | undefined): TextRun {
        const run = new TextRun([], new Style());
        const presentationNode = Xml.getFirstChildOfName(runNode, "w:rPr");
        if (presentationNode !== undefined && presentationNode.hasChildNodes()) {
            run.style.runStyle = RunStyle.fromPresentationNode(presentationNode);
        }
        if (parStyle !== undefined) {
            run.style.parStyle = parStyle;
        }
        run.texts = TextReader._getTexts(runNode);
        run.style.applyNamedStyles(namedStyles);
        return run;
    }

    private static _getTexts(runNode: ChildNode): string[] {
        const texts: string[] = [];
        if (runNode.hasChildNodes) {
            runNode.childNodes.forEach((node) => {
                switch(node.nodeName) {
                    case "w:t":
                        const content = node.textContent;
                        if (content !== null) {
                            texts.push(content);
                        }
                        break;
                    case "w:br":
                    case "w:cr":
                        texts.push(" \n ");
                        break;
                    default:
                        // Ignore all other nodes
                        break;
                }
            });
        }
        return texts;
    }
}