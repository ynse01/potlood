import { Part } from "./package/part.js";
import { Xml } from "./utils/xml.js";
import { Paragraph } from "./paragraph.js";
import { NamedStyles } from "./text/named-styles.js";
import { Section } from "./section.js";
import { AbstractNumberings } from "./numbering/abstract-numberings.js";
import { Table } from "./table/table.js";
import { Relationships } from "./package/relationships.js";
import { Package } from "./package/package.js";
import { ILayoutable } from "./i-layoutable.js";
import { VirtualFlow } from "./virtual-flow.js";

export class WordDocument implements ILayoutable {
    private part: Part;
    private pars: (Paragraph | Table)[] = [];
    private _section: Section | undefined;
    private _styles: NamedStyles | undefined;
    private _numberings: AbstractNumberings | undefined;
    private _rels: Relationships | undefined;

    public pack: Package;

    constructor(pack: Package, part: Part) {
        this.pack = pack;
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

    public performLayout(flow: VirtualFlow): void {
        this.parseContent();
        this.pars.forEach(par => {
            par.performLayout(flow);
        })
    }

    public get relationships(): Relationships | undefined {
        return this._rels;
    }

    public get styles(): NamedStyles | undefined {
        return this._styles;
    }

    public get numberings(): AbstractNumberings | undefined {
        return this._numberings;
    }

    public setRelationships(relationships: Relationships): void {
        this._rels = relationships;
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