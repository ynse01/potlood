import { Xml } from "../utils/xml.js";
import { Paragraph } from "./paragraph.js";
import { TextRun } from "../text/text-run.js";
import { TextReader } from "../text/text-reader.js";
import { DrawingRun } from "../drawing/drawing-run.js";
import { DocumentX } from "../document-x.js";
import { ParStyle } from "./par-style.js";
import { DrawingReader } from "../drawing/drawing-reader.js";
import { InSequence } from "../utils/in-sequence.js";

export class ParagraphReader {
    public static readStructuredDocumentTag(docx: DocumentX, sdtNode: Node): Paragraph[] {
        const pars: Paragraph[] = [];
        const contentNode = Xml.getFirstChildOfName(sdtNode, "w:sdtContent");
        if (contentNode !== undefined) {
            contentNode.childNodes.forEach(child => {
                switch (child.nodeName) {
                    case "w:p":
                        pars.push(ParagraphReader.readParagraph(docx, child));
                        break;
                    default:
                        // Ignore
                        break;
                }
            });
        }
        return pars;
    }

    public static readParagraph(docx: DocumentX, pNode: Node): Paragraph {
        let numberingRun: TextRun | undefined;
        let linkTarget: string | undefined = undefined;
        const runs: (TextRun | DrawingRun)[] = [];
        const parStyle = this.readStyle(docx, pNode);
        if (parStyle !== undefined && parStyle._numStyle !== undefined && parStyle._numStyle.style !== undefined) {
            numberingRun = new TextRun([parStyle._numStyle.getPrefixText([0])], parStyle._numStyle.style);
        }
        const textStyle = parStyle.clone();
        textStyle._numStyle = undefined;
        pNode.childNodes.forEach(node => {
            linkTarget = undefined;
            if (node.nodeName === "w:hyperlink") {
                const linkId = Xml.getAttribute(node, "r:id");
                if (linkId !== undefined) {
                    linkTarget = docx.relationships!.getTarget(linkId);
                }
                const firstChild = node.firstChild;
                if (firstChild !== null) {
                    node = firstChild;
                }
            }
            if (node.nodeName === "w:r") {
                node.childNodes.forEach(child => {
                    if (child.nodeName === "w:drawing") {
                        const drawing = DrawingReader.readDrawingRun(child, docx);
                        runs.push(drawing);    
                    }
                    if (child.nodeName === "mc:AlternateContent") {
                        const choiceNode = Xml.getFirstChildOfName(child, "mc:Choice");
                        if (choiceNode !== undefined) {
                            const chosenNode = Xml.getFirstChildOfName(choiceNode, "w:drawing");
                            if (chosenNode !== undefined) {
                                runs.push(DrawingReader.readDrawingRun(chosenNode, docx));
                            }
                        }                                    
                    }
                });
                // Try to load text.
                const run = TextReader.readTextRun(node, textStyle, docx.styles);
                run.inParagraph = InSequence.Middle;
                run.linkTarget = linkTarget;
                runs.push(run);
            }
        });
        const firstRun = numberingRun || runs[0];
        if (runs.length == 1 && firstRun instanceof TextRun) {
            firstRun.inParagraph = InSequence.Only;
        } else if (runs.length > 0) {
            if (firstRun instanceof TextRun) {
                firstRun.inParagraph = InSequence.First;
            }
            const lastRun = runs[runs.length - 1];
            if (lastRun instanceof TextRun) {
                lastRun.inParagraph = InSequence.Last;
            }
        }
        return new Paragraph(runs, numberingRun);
    }

    private static readStyle(docx: DocumentX, pNode: Node): ParStyle {
        const parPrNode = Xml.getFirstChildOfName(pNode, "w:pPr");
        if (parPrNode !== undefined) {
            const parStyle = ParStyle.fromParPresentationNode(parPrNode);
            parStyle.applyNamedStyles(docx.styles);
            parStyle.applyNumberings(docx.numberings);
            return parStyle;
        }
        return new ParStyle();
    }

}