import { Part } from "./part.js";
import { Xml } from "./xml.js";
import { WordParagraph } from "./word-paragraph.js";
import { WordStyles } from "./word-styles.js";
import { WordSection } from "./word-section.js";

export class WordDocument {
    private part: Part;
    private pars: WordParagraph[] = [];
    private _section: WordSection | undefined;
    private _styles: WordStyles | undefined;

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
                            case "w:p":
                                this.pars.push(new WordParagraph(this, element));
                                break;
                            case "w:sectPr":
                                this._section = new WordSection(this, element);
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

    public get styles(): WordStyles | undefined {
        return this._styles;
    }

    public setNamedStyles(styles: WordStyles): void {
        this._styles = styles;
    }

    public get paragraphs(): WordParagraph[] {
        return this.pars;
    }

    public get section(): WordSection | undefined {
        return this._section;
    }
}