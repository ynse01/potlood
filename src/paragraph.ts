import { Xml } from "./xml.js";
import { Run } from "./run.js";
import { WordDocument } from "./word-document.js";
import { ParStyle } from "./par-style.js";

export enum RunInParagraph {
    Normal = 0,
    FirstRun = 1,
    LastRun = 2,
    OnlyRun = 3,
    Numbering = 4
}

export enum ParagraphType {
    Text = 0,
    TableCell = 1,
    Drawing = 2
}

export class Paragraph {
    public type: ParagraphType;
    private pNode: ChildNode;
    private doc: WordDocument;
    private _runs: Run[] | undefined;
    private _numberingRun: Run | undefined;

    public static createEmpty(doc: WordDocument): Paragraph {
        const par = new Paragraph(doc, undefined!);
        par._runs = [];
        par._numberingRun = undefined;
        return par;
    }

    constructor(doc: WordDocument, pNode: ChildNode) {
        this.pNode = pNode;
        this.doc = doc;
        this.type = ParagraphType.Text;
    }

    public get runs(): Run[] {
        this.parseContent();
        return this._runs!;
    }

    public get numberingRun(): Run | undefined {
        this.parseContent();
        return this._numberingRun;
    }

    public getTextHeight(width: number): number {
        let height = 0;
        this.runs.forEach(run => {
            height += run.getTextHeight(width);
        });
        return height;
    }

    private parseContent(): void {
        if (this._runs === undefined) {
            const runs: Run[] = [];
            const parStyle = this.parStyle;
            if (parStyle !== undefined && parStyle._numStyle !== undefined) {
                this._numberingRun = new Run(parStyle._numStyle.getPrefixText(), parStyle._numStyle.style);
            }
            Xml.getChildrenOfName(this.pNode, "w:r").forEach(node => {
                runs.push(Run.fromRunNode(node, parStyle, this.doc.styles));
            });
            this._runs = runs;
        }
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