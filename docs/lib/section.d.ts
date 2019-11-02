import { DocumentX } from "./document-x.js";
export declare class Section {
    private sectionNode;
    private _pageHeight;
    private _pageWidth;
    private _marginTop;
    private _marginLeft;
    private _marginBottom;
    private _marginRight;
    constructor(_doc: DocumentX, sectionNode: ChildNode);
    readonly pageHeight: number | undefined;
    readonly pageWidth: number | undefined;
    readonly marginTop: number | undefined;
    readonly marginLeft: number | undefined;
    readonly marginBottom: number | undefined;
    readonly marginRight: number | undefined;
    private parseContent;
}
