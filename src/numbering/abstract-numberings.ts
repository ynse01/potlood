import { XmlPart } from "../package/xml-part";
import { Numbering } from "./numbering";
import { Xml } from "../utils/xml";
import { NamedStyles } from "../text/named-styles";

export class AbstractNumberings {

    private doc: Document;
    private _numberings: Numbering[] = [];

    constructor(part: XmlPart) {
        this.doc = part.document;
    }

    public parseContent(styles: NamedStyles | undefined): void {
        if (this._numberings.length === 0) {
            const root = Xml.getFirstChildOfName(this.doc, "w:numbering");
            if (root !== undefined) {
                const abstractNumberings: Numbering[] = [];
                root.childNodes.forEach(node => {
                    if (node.nodeName === "w:abstractNum") {
                        const abstractNumId = Xml.getAttribute(node, "w:abstractNumId");
                        if (abstractNumId !== undefined) {
                            const numbering = Numbering.fromAbstractNumNode(styles, node);
                            abstractNumberings[parseInt(abstractNumId)] = numbering;
                        }
                    }
                });
                root.childNodes.forEach(numNode => {
                    if (numNode.nodeName === "w:num") {
                        const numId = Xml.getAttribute(numNode, "w:numId");
                        const abstractNumId = Xml.getNumberValueFromNode(numNode, "w:abstractNumId");
                        if (numId !== undefined && abstractNumId !== undefined) {
                            this._numberings[parseInt(numId)] = abstractNumberings[abstractNumId];
                        }
                    }
                });
            }
        }
    }

    public getNumberingById(numId: number): Numbering {
        return this._numberings[numId];
    }
}
