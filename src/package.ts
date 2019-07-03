import { Part } from './part.js';
import { Xml } from './xml.js';

declare var JSZip: any;

export class Package {
    private package: any;
    private content: { [key: string]: string[]} = {};

    constructor(jsZip: any) {
        this.package = jsZip;
    }

    public static ChartContentType = "officedocument.drawingxml.chart";
    public static WordDocumentContentType = "officedocument.wordprocessing.document.main";
    public static WordFontTableContentType = "officedocument.wordprocessing.fontTable";
    public static WordNumberingContentType = "officedocument.wordprocessing.numbering";
    public static WordSettingsContentType = "officedocument.wordprocessing.settings";
    public static WordStylesContentType = "officedocument.wordprocessing.styles";
    public static ExtendedPropertiesContentType = "officedocument.extended-properties";
    public static CorePropertiesContentType = "package.core-properties";
    public static RelationshipsContentType = "package.relationships";
    public static JpegContentType = "image/jpeg";
    public static PngContentType = "image/png";

    public static loadFromUrl(url: string): Promise<Package> {
        return new Promise<Package>((resolve, reject) => {
            var oReq = new XMLHttpRequest();
            oReq.open("GET", url, true);
            oReq.responseType = "arraybuffer";
            
            oReq.onload = (_oEvent) => {
                var arrayBuffer = oReq.response;
                if (arrayBuffer) {
                    new JSZip().loadAsync(arrayBuffer).then((unzipped: any) => {
                        const pack = new Package(unzipped);
                        pack._loadContentTypes().then(() => {
                            resolve(pack);
                        }).catch((error: any) => {
                            reject(error);
                        });
                    }).catch((error: any) => {
                        reject(error);
                    });
                }
            };
            oReq.onerror = (evt) => {
                reject(evt);
            }
            oReq.send(null);
        });
    }

    public loadPart(name: string): Promise<Part> {
        return new Promise<Part>((resolve, reject) => {
            this.package.file(name).async("text").then((partContent: string) => {
                const partXml = new DOMParser().parseFromString(partContent, "application/xml");
                resolve(new Part(partXml));
            }).catch((error: any) => {
                reject(error);
            });
        });
    }

    public getNamesByContentType(key: string): string[] {
        return this.content[key];
    }

    private _loadContentTypes(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.loadPart('[Content_Types].xml').then(contentTypePart => {
                Xml.getChildrenOfName(contentTypePart.document.getRootNode() as ChildNode, "Override").forEach(content => {
                    const partName = Xml.getAttribute(content, "PartName");
                    const contentType = Xml.getAttribute(content, "ContentType");
                    if (partName !== undefined && contentType !== undefined) {
                        let key = contentType.replace('application/vnd.openxmlformats-', '');
                        key = key.replace('+xml', '');
                        if (this.content[key] === undefined) {
                            this.content[key] = [];
                        }
                        this.content[key].push(partName);
                    }
                });
                resolve();
            }).catch(error => {
                reject(error);
            });
        });
    }
}