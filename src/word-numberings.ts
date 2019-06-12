import { Part } from "./part.js";
import { Numbering } from "./numbering.js";
import { Xml } from "./xml.js";
import { WordStyles } from "./word-styles.js";

export class WordNumberings {

    private doc: Document;
    private _numberings: Numbering[] = [];

    constructor(part: Part) {
        this.doc = part.document;
    }

    public parseContent(styles: WordStyles | undefined): void {
        if (this._numberings.length === 0) {
            const root = Xml.getFirstChildOfName(this.doc, "w:numbering");
            if (root !== undefined) {
                const abstractNumberings: Numbering[] = [];
                Xml.getChildrenOfName(root, "w:abstractNum").forEach(node => {
                    const abstractNumId = (node as Element).getAttribute("w:abstractNumId");
                    if (abstractNumId !== null) {
                        const numbering = Numbering.fromAbstractNumNode(styles, node);
                        abstractNumberings[parseInt(abstractNumId)] = numbering;
                    }
                });
                Xml.getChildrenOfName(root, "w:num").forEach(numNode => {
                    const numId = (numNode as Element).getAttribute("w:numId");
                    const abstractNumId = Xml.getNumberValueFromNode(numNode, "w:abstractNumId");
                    if (numId !== null && abstractNumId !== undefined) {
                        this._numberings[parseInt(numId)] = abstractNumberings[abstractNumId];
                    }
                });
            }
        }
    }

    public getNumberingById(numId: number): Numbering {
        return this._numberings[numId];
    }
}
