import { Part } from "./part.js";
import { Xml } from "./xml.js";
import { Paragraph } from "./paragraph.js";
import { NamedStyles } from "./named-styles.js";
import { Section } from "./section.js";
import { AbstractNumberings } from "./abstract-numberings.js";
import { Table } from "./table.js";

export class WordDocument {
    private part: Part;
    private pars: (Paragraph | Table)[] = [];
    private _section: Section | undefined;
    private _styles: NamedStyles | undefined;
    private _numberings: AbstractNumberings | undefined;

    constructor(part: Part) {
        this.part = part;
    }

    public parseContent(): void {
        if (this.pars.length === 0) {
            const doc = Xml.getFirstChildOfName(this.part.document, "w:document");
            if (doc !== undefined) {
                const body = Xml.getFirstChildOfName(doc, "w:body");
                if (body !== undefined) {
                    body.childNodes.forEach(node => {
                        switch(node.nodeName) {
                            case "w:p":
                                this.pars.push(new Paragraph(this, node));
                                break;
                            case "w:tbl":
                                const table = Table.fromTableNode(this, node);
                                this.pars.push(table);
                                break;
                            case "w:sectPr":
                                this._section = new Section(this, node);
                                break;
                            default:
                                console.log("Don't know how to parse " + node.nodeName);
                                break;
                        }
                    });
                }
            }
        }
    }

    public get styles(): NamedStyles | undefined {
        return this._styles;
    }

    public get numberings(): AbstractNumberings | undefined {
        return this._numberings;
    }

    public setNamedStyles(styles: NamedStyles): void {
        this._styles = styles;
    }

    public setNumberings(numberings: AbstractNumberings): void {
        this._numberings = numberings;
    }

    public get paragraphs(): (Paragraph | Table)[] {
        return this.pars;
    }

    public get section(): Section | undefined {
        return this._section;
    }
}