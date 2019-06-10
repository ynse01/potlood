import { WordDocument } from "./word-document.js";
import { Xml } from "./xml.js";
import { Metrics } from "./metrics.js";

export class WordSection {
    private sectionNode: ChildNode;
    
    constructor(_doc: WordDocument, sectionNode: ChildNode) {
        this.sectionNode = sectionNode;
    }

    public get pageHeight(): number | undefined {
        let pageHeight: number | undefined = undefined;
        const pageSize = Xml.getFirstChildOfName(this.sectionNode, "w:pgSz") as Element;
        if (pageSize !== undefined) {
            const height = pageSize.getAttribute("w:h");
            if (height !== null) {
                pageHeight = Metrics.convertTwipsToPixels(parseInt(height, 10));
            }
        }
        return pageHeight;
    }

    public get pageWidth(): number | undefined {
        let pageWidth: number | undefined = undefined;
        const pageSize = Xml.getFirstChildOfName(this.sectionNode, "w:pgSz") as Element;
        if (pageSize !== undefined) {
            const width = pageSize.getAttribute("w:w");
            if (width !== null) {
                pageWidth = Metrics.convertTwipsToPixels(parseInt(width, 10));
            }
        }
        return pageWidth;
    }

    public get pageOrientation(): string {
        let pageOrientation = "portrait";
        const pageSize = Xml.getFirstChildOfName(this.sectionNode, "w:pgSz") as Element;
        if (pageSize !== undefined) {
            const orientation = pageSize.getAttribute("w:orient");
            if (orientation !== null) {
                pageOrientation = orientation;
            }
        }
        return pageOrientation;
    }

    public get sectionType(): string {
        let sectionType = Xml.getStringValueFromNode(this.sectionNode, "w:type");
        if (sectionType === undefined) {
            sectionType = "nextPage";
        }
        return sectionType;
    }

    public get pageNumberFormat(): string {
        let pageNumberFormat = "decimal";
        const pageSize = Xml.getFirstChildOfName(this.sectionNode, "w:pgNumType") as Element;
        if (pageSize !== undefined) {
            const format = pageSize.getAttribute("w:fmt");
            if (format !== null) {
                pageNumberFormat = format;
            }
        }
        return pageNumberFormat;
    }
}