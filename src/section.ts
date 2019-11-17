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
            const pageSize = Xml.getFirstChildOfName(this.sectionNode, "w:pgSz") as Element;
            if (pageSize !== undefined) {
                const width = Xml.getAttribute(pageSize, "w:w");
                if (width !== undefined) {
                    this._pageWidth = Metrics.convertTwipsToPixels(parseInt(width, 10));
                }
                const height = Xml.getAttribute(pageSize, "w:h");
                if (height !== undefined) {
                    this._pageHeight = Metrics.convertTwipsToPixels(parseInt(height, 10));
                }
            }
            const margin = Xml.getFirstChildOfName(this.sectionNode, "w:pgMar") as Element;
            if (margin !== undefined) {
                const top = Xml.getAttribute(margin, "w:top");
                if (top !== undefined) {
                    this._marginTop = Metrics.convertTwipsToPixels(parseInt(top));
                }
                const left = Xml.getAttribute(margin, "w:left");
                if (left !== undefined) {
                    this._marginLeft = Metrics.convertTwipsToPixels(parseInt(left));
                }
                const bottom = Xml.getAttribute(margin, "w:bottom");
                if (bottom !== undefined) {
                    this._marginBottom = Metrics.convertTwipsToPixels(parseInt(bottom));
                }
                const right = Xml.getAttribute(margin, "w:right");
                if (right !== undefined) {
                    this._marginRight = Metrics.convertTwipsToPixels(parseInt(right));
                }
            }
        }
    }
}