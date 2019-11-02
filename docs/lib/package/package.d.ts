import { XmlPart } from './xml-part.js';
export declare class Package {
    private package;
    private content;
    constructor(jsZip: any);
    static ChartContentType: string;
    static WordDocumentContentType: string;
    static WordFontTableContentType: string;
    static WordNumberingContentType: string;
    static WordSettingsContentType: string;
    static WordStylesContentType: string;
    static ExtendedPropertiesContentType: string;
    static CorePropertiesContentType: string;
    static RelationshipsContentType: string;
    static JpegContentType: string;
    static PngContentType: string;
    static loadFromUrl(url: string): Promise<Package>;
    static loadFromFile(files: FileList): Promise<Package>;
    private static _loadFromArrayBuffer;
    hasPart(name: string): boolean;
    loadPartAsXml(name: string): Promise<XmlPart>;
    loadPartAsBase64(name: string): Promise<string>;
    loadPartAsBinary(name: string): Promise<ArrayBuffer>;
    getNamesByContentType(key: string): string[];
    private _loadContentTypes;
}
