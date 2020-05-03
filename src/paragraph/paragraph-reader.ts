import { Xml } from "../utils/xml";
import { Paragraph, IRun } from "./paragraph";
import { TextRun } from "../text/text-run";
import { TextReader } from "../text/text-reader";
import { DocumentX } from "../document-x";
import { ParStyle } from "./par-style";
import { DrawingReader } from "../drawing/drawing-reader";
import { InSequence } from "../utils/in-sequence";
import { NumberingRun } from "../numbering/numbering-run";
import { MathReader } from "../math/math-reader";

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
        let numberingRun: NumberingRun | undefined;
        let linkTarget: string | undefined = undefined;
        const runs: IRun[] = [];
        const parStyle = this.readStyle(docx, pNode);
        if (parStyle !== undefined && parStyle.numStyle !== undefined) {
            numberingRun = new NumberingRun(parStyle.numStyle);
        }
        const textStyle = parStyle.clone();
        textStyle.numStyle = undefined;
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
            if (node.nodeName === "m:oMath") {
                const mathRun = MathReader.fromMathNode(node);
                runs.push(mathRun);
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