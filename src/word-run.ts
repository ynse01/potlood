import { Xml } from "./xml.js";
import { Style } from "./style.js";
import { SvgRenderer } from "./svg-renderer.js";
import { WordStyles } from "./word-styles.js";

export class WordRun {
    private text: string;
    private style: Style;

    constructor(styles: WordStyles | undefined, parStyle: Style | undefined, rNode: ChildNode) {
        this.text = "";
        const presentationNode = Xml.getFirstChildOfName(rNode, "w:rPr");
        if (presentationNode !== undefined && presentationNode.hasChildNodes()) {
            this.style = Style.fromPresentationNode(styles, presentationNode);
        } else {
            this.style = new Style();
        }
        if (parStyle !== undefined) {
            this.style.setBaseStyle(parStyle);
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