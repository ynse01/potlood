import { Paragraph } from "./paragraph.js";
import { DocumentX } from "../document-x.js";
export declare class ParagraphReader {
    static readParagraph(docx: DocumentX, pNode: Node): Paragraph;
    private static readStyle;
}
