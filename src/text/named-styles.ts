import { Style } from "./style.js";
import { Xml } from "../xml.js";
import { Part } from "../package/part.js";

export class NamedStyles {
    private doc: Document;
    private named: { [name: string]: Style} = {};

    constructor(part: Part) {
        this.doc = part.document;
    }

    public parseContent(): void {
        if (this.named["Normal"] === undefined) {
            const root = Xml.getFirstChildOfName(this.doc, "w:styles");
            if (root !== undefined) {
                root.childNodes.forEach(node => {
                    if (node.nodeName == "w:style") {
                        const styleType = Xml.getAttribute(node, "w:type");
                        if (styleType !== undefined && styleType !== "numbering") {
                            const style = Style.fromStyleNode(node);
                            const styleId = Xml.getAttribute(node, "w:styleId");
                            if (styleId !== undefined) {
                                this.named[styleId] = style;
                            }
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