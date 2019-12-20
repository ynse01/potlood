import { DocumentX } from "./document-x.js";
import { Xml } from "./utils/xml.js";
import { Metrics } from "./utils/metrics.js";

export class Section {
    private sectionNode: ChildNode;
    private _pageHeight: number | undefined;
    private _pageWidth: number | undefined;
    private _marginTop: number | undefined;
    private _marginLeft: number | undefined;
    private _marginBottom: number | undefined;
    private _marginRight: number | undefined;
    // TODO: SectionType, PageOrientation and PageNumberFormat

    constructor(_doc: DocumentX, sectionNode: ChildNode) {
        this.sectionNode = sectionNode;
    }

    public get pageHeight(): number | undefined {
        this.parseContent();
        return this._pageHeight;
    }

    public get pageWidth(): number | undefined {
        this.parseContent();
        return this._pageWidth;
    }

    public get marginTop(): number | undefined {
        this.parseContent();
        return this._marginTop;
    }

    public get marginLeft(): number | undefined {
        this.parseContent();
        return this._marginLeft;
    }

    public get marginBottom(): number | undefined {
        this.parseContent();
        return this._marginBottom;
    }

    public get marginRight(): number | undefined {
        this.parseContent();
        return this._marginRight;
    }

    private parseContent(): void {
        if (this._pageWidth === undefined) {
            this.sectionNode.childNodes.forEach(child => {
                switch(child.nodeName) {
                    case "w:pgSz":
                        const width = Xml.getAttribute(child, "w:w");
                        if (width !== undefined) {
                            this._pageWidth = Metrics.convertTwipsToPixels(parseInt(width, 10));
                        }
                        const height = Xml.getAttribute(child, "w:h");
                        if (height !== undefined) {
                            this._pageHeight = Metrics.convertTwipsToPixels(parseInt(height, 10));
                        }
                        break;
                    case "w:pgMar":
                        const top = Xml.getAttribute(child, "w:top");
                        if (top !== undefined) {
                            this._marginTop = Metrics.convertTwipsToPixels(parseInt(top));
                        }
                        const left = Xml.getAttribute(child, "w:left");
                        if (left !== undefined) {
                            this._marginLeft = Metrics.convertTwipsToPixels(parseInt(left));
                        }
                        const bottom = Xml.getAttribute(child, "w:bottom");
                        if (bottom !== undefined) {
                            this._marginBottom = Metrics.convertTwipsToPixels(parseInt(bottom));
                        }
                        const right = Xml.getAttribute(child, "w:right");
                        if (right !== undefined) {
                            this._marginRight = Metrics.convertTwipsToPixels(parseInt(right));
                        }
                        break;
                    case "w:textDirection":
                    case "w:docGrid":
                    case "w:pgNumType":
                    case "w:formProt":
                    case "w:type":
                        // Ignore
                        break;
                    default:
                        console.log(`Don't know how to parse ${child.nodeName} during Section reading.`);
                        break;
                }
            });
        }
    }
}