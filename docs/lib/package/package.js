import { XmlPart } from './xml-part.js';
import { Xml } from '../utils/xml.js';
export class Package {
    constructor(jsZip) {
        this.content = {};
        this.package = jsZip;
    }
    static loadFromUrl(url) {
        return new Promise((resolve, reject) => {
            var oReq = new XMLHttpRequest();
            oReq.open("GET", url, true);
            oReq.responseType = "arraybuffer";
            oReq.onload = (_oEvent) => {
                if (oReq.status === 200) {
                    var arrayBuffer = oReq.response;
                    Package._loadFromArrayBuffer(arrayBuffer)
                        .then((pack) => resolve(pack))
                        .catch((err) => reject(err));
                }
                else {
                    reject(`File not found: ${url}`);
                }
            };
            oReq.onerror = (evt) => {
                reject(evt);
            };
            oReq.send(null);
        });
    }
    static loadFromFile(files) {
        return new Promise((resolve, reject) => {
            for (var i = 0, file; file = files[i]; i++) {
                if (file.name.endsWith('.docx')) {
                    var reader = new FileReader();
                    reader.onload = (e2) => {
                        // finished reading file data.
                        Package._loadFromArrayBuffer(e2.target.result).then(pack => resolve(pack)).catch(err => reject(err));
                    };
                    reader.readAsArrayBuffer(file); // start reading the file data.
                    break;
                }
            }
        });
    }
    static _loadFromArrayBuffer(arrayBuffer) {
        return new Promise((resolve, reject) => {
            if (arrayBuffer && arrayBuffer.byteLength > 0) {
                new JSZip().loadAsync(arrayBuffer).then((unzipped) => {
                    const pack = new Package(unzipped);
                    pack._loadContentTypes().then(() => {
                        resolve(pack);
                    }).catch((error) => {
                        reject(error);
                    });
                }).catch((error) => {
                    reject(error);
                });
            }
            else {
                reject("No data received.");
            }
        });
    }
    hasPart(name) {
        return this.package.file(name) !== null;
    }
    loadPartAsXml(name) {
        return new Promise((resolve, reject) => {
            this.package.file(name).async("text").then((partContent) => {
                const partXml = new DOMParser().parseFromString(partContent, "application/xml");
                resolve(new XmlPart(partXml));
            }).catch((error) => {
                reject(error);
            });
        });
    }
    loadPartAsBase64(name) {
        return new Promise((resolve, reject) => {
            this.package.file(name).async("base64").then((content) => {
                resolve(content);
            }).catch((error) => {
                reject(error);
            });
        });
    }
    loadPartAsBinary(name) {
        return new Promise((resolve, reject) => {
            this.package.file(name).async("arraybuffer").then((content) => {
                resolve(content);
            }).catch((error) => {
                reject(error);
            });
        });
    }
    getNamesByContentType(key) {
        return this.content[key];
    }
    _loadContentTypes() {
        return new Promise((resolve, reject) => {
            this.loadPartAsXml('[Content_Types].xml').then(contentTypePart => {
                contentTypePart.document.getRootNode().childNodes.forEach(content => {
                    if (content.nodeName === "Override") {
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
                    }
                });
                resolve();
            }).catch(error => {
                reject(error);
            });
        });
    }
}
Package.ChartContentType = "officedocument.drawingxml.chart";
Package.WordDocumentContentType = "officedocument.wordprocessing.document.main";
Package.WordFontTableContentType = "officedocument.wordprocessing.fontTable";
Package.WordNumberingContentType = "officedocument.wordprocessing.numbering";
Package.WordSettingsContentType = "officedocument.wordprocessing.settings";
Package.WordStylesContentType = "officedocument.wordprocessing.styles";
Package.ExtendedPropertiesContentType = "officedocument.extended-properties";
Package.CorePropertiesContentType = "package.core-properties";
Package.RelationshipsContentType = "package.relationships";
Package.JpegContentType = "image/jpeg";
Package.PngContentType = "image/png";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wYWNrYWdlL3BhY2thZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN4QyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFJdEMsTUFBTSxPQUFPLE9BQU87SUFJaEIsWUFBWSxLQUFVO1FBRmQsWUFBTyxHQUErQixFQUFFLENBQUM7UUFHN0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDekIsQ0FBQztJQWNNLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBVztRQUNqQyxPQUFPLElBQUksT0FBTyxDQUFVLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQzVDLElBQUksSUFBSSxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7WUFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxZQUFZLEdBQUcsYUFBYSxDQUFDO1lBRWxDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxPQUFPLEVBQUUsRUFBRTtnQkFDdEIsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRTtvQkFDckIsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDaEMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLFdBQVcsQ0FBQzt5QkFDcEMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7eUJBQzdCLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7aUJBQ3BDO3FCQUFNO29CQUNILE1BQU0sQ0FBQyxtQkFBbUIsR0FBRyxFQUFFLENBQUMsQ0FBQztp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