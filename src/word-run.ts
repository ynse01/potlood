import { Xml } from "./xml.js";
import { RunStyle } from "./run-style.js";
import { SvgRenderer } from "./svg-renderer.js";
import { ParStyle } from "./par-style.js";
import { Style } from "./style.js";

export class WordRun {
    private text: string;
    private style: Style;

    constructor(parStyle: ParStyle | undefined, rNode: ChildNode) {
        this.style = new Style();
        this.text = "";
        const presentationNode = Xml.getFirstChildOfName(rNode, "w:rPr");
        if (presentationNode !== undefined && presentationNode.hasChildNodes()) {
            this.style.runStyle = RunStyle.fromPresentationNode(presentationNode);
        }
        if (parStyle !== undefined) {
            this.style.parStyle = parStyle;
        }
        const textNode = Xml.getFirstChildOfName(rNode, "w:t");
        if (textNode !== undefined) {
            const text = textNode.textContent;
            if (text !== null) {
                this.text = text;
            }
        }
    }

    public render(renderer: SvgRenderer, yPos: number): number {
        return renderer.flowText(this.text, this.style, yPos);
    }
}