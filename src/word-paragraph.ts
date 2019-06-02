import { Xml } from "./xml.js";
import { WordRun } from "./word-run.js";
import { WordDocument } from "./word-document.js";
import { WordStyles } from "./word-styles.js";
import { Style } from "./style.js";

export class WordParagraph {
    private pNode: ChildNode;
    private styles: WordStyles | undefined;
    private _runs: WordRun[] | undefined;

    constructor(doc: WordDocument, pNode: ChildNode) {
        this.pNode = pNode;
        this.styles = doc.styles;
    }

    public get runs(): WordRun[] {
        if (this._runs === undefined) {
            const runs: WordRun[] = [];
            const mainStyle = this.parStyle;
            Xml.getChildrenOfName(this.pNode, "w:r").forEach(node => {
                runs.push(new WordRun(this.styles, mainStyle, node));
            });
            this._runs = runs;
        }
        return this._runs;
    }

    private get parStyle(): Style | undefined {
        const parPrNode = Xml.getFirstChildOfName(this.pNode, "w:pPr");
        if (parPrNode !== undefined) {
            const parStyle = Style.fromParPresentationNode(this.styles, parPrNode);
            if (parStyle !== undefined) {
                return parStyle;
            }
        }
        return undefined;
    }
}