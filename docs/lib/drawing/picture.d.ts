import { DocumentX } from "../document-x.js";
import { Package } from "../package/package.js";
export declare class Picture {
    private _pack;
    private _name;
    private _imageUrl;
    static fromPicNode(picNode: ChildNode, docx: DocumentX): Picture | undefined;
    constructor(pack: Package, name: string);
    getImageUrl(): Promise<string>;
    readonly isJpeg: boolean;
    readonly isPng: boolean;
    readonly isTiff: boolean;
    private _getImageUrlForJpeg;
    private _getImageUrlForPng;
    private _getImageUrlForTiff;
}
