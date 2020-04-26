import { DocumentX } from "../document-x.js";
import { Package } from "../package/package.js";
import { Xml } from "../utils/xml.js";
import { Box } from "../utils/geometry/box.js";
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
                const fileParts = this._name.split('.');
                const fileExtension = fileParts[fileParts.length - 1];
                let binaryProc: ((buffer: ArrayBuffer, bounds: Box) => Promise<string | SVGElement>) | undefined = undefined;
                let mimeType: string | undefined = undefined;
                switch(fileExtension) {
                    case "jpg":
                    case "jpeg":
                        mimeType = 'image/jpeg';
                        break;
                    case "png":
                        mimeType = 'image/png';
                        break;
                    case "gif":
                        mimeType = 'image/gif';
                        break;
                    case "bmp":
                        mimeType = 'image/bmp';
                        break;
                    case "webp":
                        mimeType = 'image/webp';
                        break;
                    case "tif":
                    case "tiff":
                        if (this._hasTiffSupport) {
                            binaryProc = this._getImageUrlForTiff;
                        }
                        break;
                    case "wmf":
                        if (this._hasWmfSupport) {
                            binaryProc = this._getImageUrlForWmf;
                        }
                        break;
                    case "wmz":
                        // TODO: Implement decompression to WMF
                        break;
                    case "emf":
                        if (this._hasEmfSupport) {
                            binaryProc = this._getImageUrlForEmf;
                        }
                        break;
                    case "emz":
                        // TODO: Implement decompression to EMF
                        break;
                }
                if (mimeType !== undefined) {
                    this._pack.loadPartAsBase64(this._name).then(content => {
                        this._imageUrl = `data:${mimeType};base64,${content}`;
                        resolve(this._imageUrl);
                    }).catch(error => {
                        reject(error);
                    });
                } else if (binaryProc !== undefined && this.bounds !== undefined) {
                    const bounds = this.bounds;
                    this._pack.loadPartAsBinary(this._name).then(buffer => {
                        binaryProc!(buffer, bounds).then((url) => {
                            this._imageUrl = url;
                            resolve(this._imageUrl);
                        }).catch((err: any) => {
                            reject(err);
                        });
                    });
                }
            }
        });
    }


    public performLayout(_flow: VirtualFlow): void {
    }

    private get _hasTiffSupport(): boolean {
        return UTIF !== undefined;
    }

    private _getImageUrlForTiff(buffer: ArrayBuffer, _bounds: Box): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const ifds = UTIF.decode(buffer);
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
            UTIF.decodeImage(buffer, page, ifds);
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
                resolve(canvas.toDataURL());
            } else {
                reject("Unable to create offscreen Canvas element");
            }
        });
    }

    private get _hasEmfSupport(): boolean {
        return EMFJS !== undefined;
    }

    private _getImageUrlForEmf(buffer: ArrayBuffer, bounds: Box): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            EMFJS.loggingEnabled(false);
            const renderer = new EMFJS.Renderer(buffer);
            const width = bounds.width;
            const height = bounds.height;
            const settings = {
                width: width + "pt",
                height: height + "pt",
                xExt: width,
                yExt: height,
                mapMode: 8
            }
            const result = renderer.render(settings);
            if (result !== undefined) {
                resolve(result);
            } else {
                reject("Error during WMF parsing.");  
            }
        });
    }

    private get _hasWmfSupport(): boolean {
        return WMFJS !== undefined;
    }

    private _getImageUrlForWmf(buffer: ArrayBuffer, bounds: Box): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            WMFJS.loggingEnabled(false);
            const renderer = new WMFJS.Renderer(buffer);
            const width = bounds.width;
            const height = bounds.height;
            const settings = {
                width: width + "pt",
                height: height + "pt",
                xExt: width,
                yExt: height,
                mapMode: 8
            }
            const result = renderer.render(settings);
            if (result !== undefined) {
                resolve(result);
            } else {
                reject("Error during WMF parsing.");  
            }
        });
    }
}