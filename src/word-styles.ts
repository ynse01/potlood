import { Style } from "./style.js";
import { Xml } from "./xml.js";
import { Part } from "./part.js";

export class WordStyles {
    private doc: Document;
    private named: { [name: string]: Style} = {};

    constructor(part: Part) {
        this.doc = part.document;
    }

    public parseContent(): void {
        if (this.named["Normal"] === undefined) {
            const root = Xml.getFirstChildOfName(this.doc, "w:styles");
            if (root !== undefined) {
                Xml.getChildrenOfName(root, "w:style").forEach(node => {
                    const styleType = (node as Element).getAttribute("w:type");
                    if (styleType !== null && styleType !== "numbering") {
                        const style = Style.fromStyleNode(node);
                        const styleId = (node as Element).getAttribute("w:styleId");
                        if (styleId !== null) {
                            this.named[styleId] = style;
                        }
                    }
                });
            }
            for (const name in this.named) {
                if (this.named.hasOwnProperty(name)) {
                    const style = this.named[name];
                    style.applyNamedStyles(this);
                }
            }
        }
    }

    public getNamedStyle(name: string): Style | undefined {
        return this.named[name];
    }

    public printDebugInfo(): void {
        for (const name in this.named) {
            if (this.named.hasOwnProperty(name)) {
                const style = this.named[name];
                console.log(`${name}: ${style.toString()}`);
                if (style.parStyle) {
                    console.log(style.parStyle.toString());
                }
                if (style.runStyle) {
                    console.log(style.runStyle.toString());
                }
            }
        }
    }
}