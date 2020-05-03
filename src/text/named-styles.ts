import { Style } from "./style";
import { Xml } from "../utils/xml";
import { XmlPart } from "../package/xml-part";

export class NamedStyles {
    private doc: Document;
    private named: { [name: string]: Style} = {};
    private _docDefaultStyle: Style;

    constructor(part: XmlPart) {
        this.doc = part.document;
        this._docDefaultStyle = new Style();
    }

    public parseContent(): void {
        if (this.named["Normal"] === undefined) {
            const root = Xml.getFirstChildOfName(this.doc, "w:styles");
            if (root !== undefined) {
                root.childNodes.forEach(child => {
                    switch(child.nodeName) {
                        case "w:style":
                            const styleType = Xml.getAttribute(child, "w:type");
                            if (styleType !== undefined && styleType !== "numbering") {
                                const style = Style.fromStyleNode(child);
                                const styleId = Xml.getAttribute(child, "w:styleId");
                                if (styleId !== undefined) {
                                    this.named[styleId] = style;
                                }
                            }
                            break;
                        case "w:docDefaults":
                            this._docDefaultStyle = Style.fromDocDefaultsNode(child);
                            break;
                        case "w:latentStyles":
                            // Ignore, UI related.
                            break;
                        default:
                            console.log(`Don't know how to parse ${child.nodeName} during NamedStyle reading.`);
                            break;
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

    public get docDefaults(): Style {
        return this._docDefaultStyle;
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