import { Xml } from "./utils/xml.js";
import { TextRun } from "./text/text-run.js";
import { WordDocument } from "./word-document.js";
import { ParStyle } from "./text/par-style.js";
import { DrawingRun } from "./drawing/drawing-run.js";
import { ILayoutable } from "./i-layoutable.js";
import { VirtualFlow } from "./virtual-flow.js";
import { FlowPosition } from "./flow-position.js";

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

export class Paragraph implements ILayoutable {
    public type: ParagraphType;
    private pNode: ChildNode;
    private doc: WordDocument;
    private _runs: (TextRun | DrawingRun)[] | undefined;
    private _numberingRun: TextRun | undefined;

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

    public get runs(): (TextRun | DrawingRun)[] {
        this.parseContent();
        return this._runs!;
    }

    public get numberingRun(): TextRun | undefined {
        this.parseContent();
        return this._numberingRun;
    }

    public getTextHeight(width: number): number {
        let height = 0;
        this.runs.forEach(run => {
            height += run.getHeight(width);
        });
        return height;
    }

    public performLayout(flow: VirtualFlow, pos: FlowPosition): void {
        this.parseContent();
        let previousXPos = -1;
        this.runs.forEach(run => {
            run.previousXPos = previousXPos;
            run.performLayout(flow, pos);
            previousXPos = run.lastXPos!;
        })
    }

    private parseContent(): void {
        if (this._runs === undefined) {
            const runs: (TextRun | DrawingRun)[] = [];
            const parStyle = this.parStyle;
            if (parStyle !== undefined && parStyle._numStyle !== undefined) {
                this._numberingRun = new TextRun(parStyle._numStyle.getPrefixText(), parStyle._numStyle.style);
            }
            this.pNode.childNodes.forEach(node => {
                if (node.nodeName === "w:hyperlink") {
                    const firstChild = node.firstChild;
                    if (firstChild !== null) {
                        node = firstChild;
                    }
                }
                if (node.nodeName === "w:r") {
                    const drawingNode = Xml.getFirstChildOfName(node, "w:drawing");
                    if (drawingNode !== undefined) {
                        const drawing = DrawingRun.fromDrawingNode(drawingNode, this.doc);
                        runs.push(drawing);
                    } else {
                        const run = TextRun.fromRunNode(node, parStyle, this.doc.styles);
                        run.inParagraph = RunInParagraph.Normal;
                        runs.push(run);
                    }
                }
            });
            const firstRun = runs[0]
            if (runs.length == 1 && firstRun instanceof TextRun) {
                firstRun.inParagraph = RunInParagraph.OnlyRun;
            } else if (runs.length > 0) {
                if (firstRun instanceof TextRun) {
                    firstRun.inParagraph = RunInParagraph.FirstRun;
                }
                const lastRun = runs[runs.length - 1];
                if (lastRun instanceof TextRun) {
                    lastRun.inParagraph = RunInParagraph.LastRun;
                }
            }
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