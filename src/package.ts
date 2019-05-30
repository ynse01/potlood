import { Part } from './part.js';

declare var JSZip: any;

export class Package {
    private package: any;

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
}