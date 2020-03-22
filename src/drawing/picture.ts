import { DocumentX } from "../document-x.js";
import { Package } from "../package/package.js";
import { Xml } from "../utils/xml.js";
import { Box } from "../utils/math/box.js";
import { ILayoutable } from "../utils/i-layoutable.js";
import { VirtualFlow } from "../utils/virtual-flow.js";

declare var UTIF: any;
declare var WMFJS: any;
declare var EMFJS: any;

export class Picture implements ILayoutable {
    private _pack: Package;
    private _name: string;
    private _imageUrl: string | SVGElement | undefined;
    public bounds: Box | undefined;

    public static fromPicNode(picNode: ChildNode, docx: DocumentX): Picture | undefined {
        let run: Picture | undefined = undefined;
        const blipFill = Xml.getFirstChildOfName(picNode, "pic:blipFill");
        if (blipFill !== undefined) {
            const blip = Xml.getFirstChildOfName(blipFill, "a:blip");
            if (blip !== undefined) {
                const relId = Xml.getAttribute(blip, "r:embed");
                let target: string | undefined = undefined;
                if (docx.relationships !== undefined && relId !== undefined) {
                    target = docx.relationships.getTarget(relId);
                    run = new Picture(docx.pack, `word/${target}`);
                }
            }
        }
        return run;
    }

    constructor(pack: Package, name: string) {
        this._pack = pack;
        this._name = name;
    }

    public getImageUrl(): Promise<string | SVGElement> {
        return new Promise<string | SVGElement>((resolve, reject) => {
            if (this._imageUrl !== undefined) {
                resolve(this._imageUrl);
            } else {
                if (this.isJpeg) {
                    this._getImageUrlForJpeg().then(() => {
                        resolve(this._imageUrl);
                    }).catch((err: any) => {
                        reject(err);
                    });
                } else if (this.isPng) {
                    this._getImageUrlForPng().then(() => {
                        resolve(this._imageUrl);
                    }).catch((err: any) => {
                        reject(err);
                    });
                } else if (this.isTiff) {
                    this._getImageUrlForTiff().then(() => {
                        resolve(this._imageUrl);
                    }).catch((err: any) => {
                        reject(err);
                    });
                } else if (this.isWmf) {
                    this._getImageUrlForWmf().then(() => {
                        resolve(this._imageUrl);
                    }).catch((err: any) => {
                        reject(err);
                    });
                } else if (this.isEmf) {
                    this._getImageUrlForEmf().then(() => {
                        resolve(this._imageUrl);
                    }).catch((err: any) => {
                        reject(err);
                    });
                } else {
                    reject(`Unknown image at: ${this._name}`);
                }
            }
        });
    }

    public get isJpeg(): boolean {
        return this._name.endsWith('.jpg') || this._name.endsWith('.jpeg');
    }

    public get isPng(): boolean {
        return this._name.endsWith('.png');
    }

    public get isTiff(): boolean {
        return this._name.endsWith('.tif') || this._name.endsWith('.tiff');
    }

    public get isWmf(): boolean {
        return this._name.endsWith('.wmf');
    }

    public get isEmf(): boolean {
        return this._name.endsWith('.emf');
    }

    public performLayout(_flow: VirtualFlow): void {
    }

    private _getImageUrlForJpeg(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._pack.loadPartAsBase64(this._name).then(content => {
                const mimeType = 'image/jpeg';
                this._imageUrl = `data:${mimeType};base64,${content}`;
                resolve();
            }).catch(error => {
                reject(error);
            });
        });
    }

    private _getImageUrlForPng(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._pack.loadPartAsBase64(this._name).then(content => {
                const mimeType = 'image/png';
                this._imageUrl = `data:${mimeType};base64,${content}`;
                resolve();
            }).catch(error => {
                reject(error);
            });
        });
    }

    private _getImageUrlForTiff(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._pack.loadPartAsBinary(this._name).then(buff => {
                const ifds = UTIF.decode(buff);
                let vsns = ifds;
                let ma = 0;
                let page = vsns[0];
                if (ifds[0].subIFD) {
                    vsns = vsns.concat(ifds[0].subIFD);
                }
                for (let i = 0; i < vsns.length; i++) {
                    const img = vsns[i];
                    if (img["t258"] === null || img["t258"].length < 3) {
                        continue;
                    }
                    const ar = img["t256"] * img["t257"];
                    if (ar > ma) {
                        ma = ar;
                        page = img;
                    }
                }
                UTIF.decodeImage(buff, page, ifds);
                const rgba = UTIF.toRGBA8(page)
                const width = page.width
                const height = page.height;
                const ind = 0; // TODO: Should we check for index??
                UTIF._xhrs.splice(ind, 1);
                var canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const context = canvas.getContext("2d");
                if (context !== null) {
                    const imgd = context.createImageData(width, height);
                    for (let i = 0; i < rgba.length; i++) {
                        imgd.data[i] = rgba[i];
                    }
                    context.putImageData(imgd, 0, 0);
                    this._imageUrl = canvas.toDataURL();
                    resolve();
                } else {
                    reject("Unable to create offscreen Canvas element");
                }
            }).catch(error => {
                reject(error);
            });
        });
    }

    private _getImageUrlForEmf(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (EMFJS == undefined) {
                reject("EMFJS library not loaded, unable to read EMF image");
            } else {
                EMFJS.loggingEnabled(false);
                this._pack.loadPartAsBinary(this._name).then(buff => {
                    const width = this.bounds?.width;
                    const height = this.bounds?.height;
                    const settings = {
                        width: width + "px",
                        height: height + "px",
                        xExt: width,
                        yExt: height,
                        mapMode: 8
                    }
                    const renderer = new EMFJS.Renderer(buff);
                    renderer.render(settings).then((svg: SVGElement) => {
                        this._imageUrl = svg;
                        resolve();
                    }).catch((error: any) => {
                        if (error instanceof WMFJS.Error) {
                            reject(`Error during WMF parsing: ${error.message}`);
                        } else {
                            reject(error);
                        }  
                    });
                }).catch(error => {
                    reject(error);
                });
            }
        });
    }

    private _getImageUrlForWmf(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (WMFJS == undefined) {
                reject("WMFJS library not loaded, unable to read WMF image");
            } else {
                WMFJS.loggingEnabled(false);
                this._pack.loadPartAsBinary(this._name).then(buff => {
                    const width = this.bounds?.width;
                    const height = this.bounds?.height;
                    const settings = {
                        width: width + "px",
                        height: height + "px",
                        xExt: width,
                        yExt: height,
                        mapMode: 8
                    }
                    const renderer = new WMFJS.Renderer(buff);
                    const result = renderer.render(settings)
                    if (result[0] !== undefined) {
                        this._imageUrl = result[0];
                        resolve();
                    } else {
                        reject("Error during WMF parsing.");  
                    }
                }).catch(error => {
                    reject(error);
                });
            }
        });
    }
}