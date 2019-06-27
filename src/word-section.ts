import { WordDocument } from "./word-document.js";
import { Xml } from "./xml.js";
import { Metrics } from "./metrics.js";

export class WordSection {
    private sectionNode: ChildNode;
    private _pageHeight: number | undefined;
    private _pageWidth: number | undefined;
    private _marginTop: number | undefined;
    private _marginLeft: number | undefined;
    private _marginBottom: number | undefined;
    private _marginRight: number | undefined;
    // TODO: SectionType, PageOrientation and PageNumberFormat

    constructor(_doc: WordDocument, sectionNode: ChildNode) {
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
                const width = pageSize.getAttribute("w:w");
                if (width !== null) {
                    this._pageWidth = Metrics.convertTwipsToPixels(parseInt(width, 10));
                }
                const height = pageSize.getAttribute("w:h");
                if (height !== null) {
                    this._pageHeight = Metrics.convertTwipsToPixels(parseInt(height, 10));
                }
            }
            const margin = Xml.getFirstChildOfName(this.sectionNode, "w:pgMar") as Element;
            if (margin !== undefined) {
                const top = margin.getAttribute("w:top");
                if (top !== null) {
                    this._marginTop = parseInt(top);
                }
                const left = margin.getAttribute("w:left");
                if (left !== null) {
                    this._marginLeft = parseInt(left);
                }
                const bottom = margin.getAttribute("w:bottom");
                if (bottom !== null) {
                    this._marginBottom = parseInt(bottom);
                }
                const right = margin.getAttribute("w:right");
                if (right !== null) {
                    this._marginRight = parseInt(right);
                }
            }
        }
    }
}