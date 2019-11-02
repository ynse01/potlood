import { Xml } from "../utils/xml.js";
export class Picture {
    constructor(pack, name) {
        this._pack = pack;
        this._name = name;
    }
    static fromPicNode(picNode, docx) {
        let run = undefined;
        const blipFill = Xml.getFirstChildOfName(picNode, "pic:blipFill");
        if (blipFill !== undefined) {
            const blip = Xml.getFirstChildOfName(blipFill, "a:blip");
            if (blip !== undefined) {
                const relId = Xml.getAttribute(blip, "r:embed");
                let target = undefined;
                if (docx.relationships !== undefined && relId !== undefined) {
                    target = docx.relationships.getTarget(relId);
                    run = new Picture(docx.pack, `word/${target}`);
                }
            }
        }
        return run;
    }
    getImageUrl() {
        return new Promise((resolve, reject) => {
            if (this._imageUrl !== undefined) {
                resolve(this._imageUrl);
            }
            else {
                if (this.isJpeg) {
                    this._getImageUrlForJpeg().then(() => {
                        resolve(this._imageUrl);
                    }).catch((err) => {
                        reject(err);
                    });
                }
                else if (this.isPng) {
                    this._getImageUrlForPng().then(() => {
                        resolve(this._imageUrl);
                    }).catch((err) => {
                        reject(err);
                    });
                }
                else if (this.isTiff) {
                    this._getImageUrlForTiff().then(() => {
                        resolve(this._imageUrl);
                    }).catch((err) => {
                        reject(err);
                    });
                }
                else {
                    reject(`Unknown image at: ${this._name}`);
                }
            }
        });
    }
    get isJpeg() {
        return this._name.endsWith('.jpg') || this._name.endsWith('.jpeg');
    }
    get isPng() {
        return this._name.endsWith('.png');
    }
    get isTiff() {
        return this._name.endsWith('.tif') || this._name.endsWith('.tiff');
    }
    _getImageUrlForJpeg() {
        return new Promise((resolve, reject) => {
            this._pack.loadPartAsBase64(this._name).then(content => {
                const mimeType = 'image/jpeg';
                this._imageUrl = `data:${mimeType};base64,${content}`;
                resolve();
            }).catch(error => {
                reject(error);
            });
        });
    }
    _getImageUrlForPng() {
        return new Promise((resolve, reject) => {
            this._pack.loadPartAsBase64(this._name).then(content => {
                const mimeType = 'image/png';
                this._imageUrl = `data:${mimeType};base64,${content}`;
                resolve();
            }).catch(error => {
                reject(error);
            });
        });
    }
    _getImageUrlForTiff() {
        return new Promise((resolve, reject) => {
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
                const rgba = UTIF.toRGBA8(page);
                const width = page.width;
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
                }
                else {
                    reject("Unable to create offscreen Canvas element");
                }
            }).catch(error => {
                reject(error);
            });
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGljdHVyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kcmF3aW5nL3BpY3R1cmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBSXRDLE1BQU0sT0FBTyxPQUFPO0lBc0JoQixZQUFZLElBQWEsRUFBRSxJQUFZO1FBQ25DLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ3RCLENBQUM7SUFwQk0sTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFrQixFQUFFLElBQWU7UUFDekQsSUFBSSxHQUFHLEdBQXdCLFNBQVMsQ0FBQztRQUN6QyxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ2xFLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtZQUN4QixNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsbUJBQW1CLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3pELElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtnQkFDcEIsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQ2hELElBQUksTUFBTSxHQUF1QixTQUFTLENBQUM7Z0JBQzNDLElBQUksSUFBSSxDQUFDLGFBQWEsS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtvQkFDekQsTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUM3QyxHQUFHLEdBQUcsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLE1BQU0sRUFBRSxDQUFDLENBQUM7aUJBQ2xEO2FBQ0o7U0FDSjtRQUNELE9BQU8sR0FBRyxDQUFD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