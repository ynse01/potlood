import { Xml } from "./xml.js";
import { WordRun } from "./word-run.js";
import { WordDocument } from "./word-document.js";
import { ParStyle } from "./par-style.js";

export class WordParagraph {
    private pNode: ChildNode;
    private doc: WordDocument;
    private _runs: WordRun[] | undefined;
    private _numberingRun: WordRun | undefined;

    constructor(doc: WordDocument, pNode: ChildNode) {
        this.pNode = pNode;
        this.doc = doc;
    }

    public parseContent(): void {
        if (this._runs === undefined) {
            const runs: WordRun[] = [];
            const parStyle = this.parStyle;
            if (parStyle !== undefined && parStyle._numStyle !== undefined) {
                this._numberingRun = new WordRun(parStyle._numStyle.getPrefixText(), parStyle._numStyle.style);
            }
            Xml.getChildrenOfName(this.pNode, "w:r").forEach(node => {
                runs.push(WordRun.fromRunNode(node, parStyle));
            });
            this._runs = runs;
        }
    }

    public get runs(): WordRun[] {
        this.parseContent();
        return this._runs!;
    }

    public get numberingRun(): WordRun | undefined {
        this.parseContent();
        return this._numberingRun;
    }

    private get parStyle(): ParStyle | undefined {
        const parPrNode = Xml.getFirstChildOfName(this.pNode, "w:pPr");
        if (parPrNode !== undefined) {
            const parStyle = ParStyle.fromParPresentationNode(parPrNode);
            if (parStyle !== undefined) {
                parStyle.applyNamedStyles(this.doc.styles);
                parStyle.applyNumberings(this.doc.numberings);
                return parStyle;
            }
        }
        return undefined;
    }
}