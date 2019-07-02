import { Part } from './part.js';
import { Xml } from './xml.js';

declare var JSZip: any;

export class Package {
    private package: any;
    private content: { [key: string]: string[]} = {};

    constructor(jsZip: any) {
        this.package = jsZip;
    }

    public static loadFromUrl(url: string): Promise<Package> {
        return new Promise<Package>((resolve, reject) => {
            var oReq = new XMLHttpRequest();
            oReq.open("GET", url, true);
            oReq.responseType = "arraybuffer";
            
            oReq.onload = (_oEvent) => {
                var arrayBuffer = oReq.response;
                if (arrayBuffer) {
                    new JSZip().loadAsync(arrayBuffer).then((unzipped: any) => {
                        resolve(new Package(unzipped));
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

    public loadPartByContentType(key: string): Promise<Part[]> {
        return new Promise<Part[]>((resolve, reject) => {
            const promises: Promise<Part>[] = [];
            const partNames = this.content[key];
            if (partNames !== undefined) {
                partNames.forEach(name => {
                    promises.push(this.loadPart(name));
                });
            }
            Promise.all(promises).then(parts => {
                resolve(parts)
            }).catch(error => {
                reject(error);
            });
        });
    }

    public loadContentTypes(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.loadPart('[Content_Types].xml').then(contentTypePart => {
                Xml.getChildrenOfName(contentTypePart.document.getRootNode() as ChildNode, "Override").forEach(content => {
                    const element = content as Element;
                    const partName = element.getAttribute("PartName");
                    const contentType = element.getAttribute("ContentType");
                    if (partName !== null && contentType !== null) {
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