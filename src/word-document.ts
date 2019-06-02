import { Part } from "./part.js";
import { Xml } from "./xml.js";
import { WordParagraph } from "./word-paragraph.js";

export class WordDocument {
    private part: Part;
    private pars: WordParagraph[] = [];

    constructor(part: Part) {
        this.part = part;
    }

    public parseContent(): void {
        if (this.pars.length === 0) {
            const doc = Xml.getFirstChildOfName(this.part.document, "w:document");
            if (doc !== undefined) {
                const body = Xml.getFirstChildOfName(doc, "w:body");
                if (body !== undefined) {
                    body.childNodes.forEach(element => {
                        switch(element.nodeName) {
                            case "p":
                            case "w:p":
                                this.pars.push(new WordParagraph(element));
                                break;
                            default:
                                console.log("Don't know how to parse " + element.nodeName);
                                break;
                        }
                    });
                }
            }
        }
    }

    public get paragraphs(): WordParagraph[] {
        return this.pars;
    }
}