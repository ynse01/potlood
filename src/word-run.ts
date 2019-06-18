import { Xml } from "./xml.js";
import { RunStyle } from "./run-style.js";
import { ParStyle } from "./par-style.js";
import { Style } from "./style.js";

export class WordRun {
    public text: string;
    public style: Style;

    public static fromRunNode(rNode: ChildNode, parStyle: ParStyle | undefined): WordRun {
        const run = new WordRun("", new Style());
        const presentationNode = Xml.getFirstChildOfName(rNode, "w:rPr");
        if (presentationNode !== undefined && presentationNode.hasChildNodes()) {
            run.style.runStyle = RunStyle.fromPresentationNode(presentationNode);
        }
        if (parStyle !== undefined) {
            run.style.parStyle = parStyle;
        }
        const textNode = Xml.getFirstChildOfName(rNode, "w:t");
        if (textNode !== undefined) {
            const text = textNode.textContent;
            if (text !== null) {
                run.text = text;
            }
        }
        return run;
    }

    constructor(text: string, style: Style) {
        this.style = style;
        this.text = text;
    }
}