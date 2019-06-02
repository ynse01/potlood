import { Xml } from "./xml.js";
import { Style } from "./style.js";
import { SvgRenderer } from "./svg-renderer.js";

export class WordRun {
    private text: string;
    private style: Style;

    constructor(rNode: ChildNode) {
        this.text = "";
        const presentationNode = Xml.getFirstChildOfName(rNode, "w:rPr");
        if (presentationNode !== undefined) {
            this.style = Style.fromPresentationNode(presentationNode);
        } else {
            this.style = new Style();
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