import { WordDocument } from "./word-document.js";
import { Package } from "./package.js";
import { Xml } from "./xml.js";

export class Picture {
    private _pack: Package;
    private _name: string;
    private _image: HTMLImageElement | undefined;

    public static fromPicNode(picNode: ChildNode, doc: WordDocument): Picture | undefined {
        let run: Picture | undefined = undefined;
        const blib = Xml.getChildrenOfName(picNode, "blib");
        if (blib !== undefined && blib.length > 0) {
            const relId = Xml.getAttribute(blib[0], "r:embed");
            let target: string | undefined = undefined;
            if (doc.relationships !== undefined && relId !== undefined) {
                target = doc.relationships.getTarget(relId);
                run = new Picture(doc.pack, target);
            }
        }
        return run;
    }

    constructor(pack: Package, name: string) {
        this._pack = pack;
        this._name = name;
    }

    public getImage(): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            if (this._image !== undefined) {
                resolve(this._image);
            } else {
                this._pack.loadImage(this._name).then(image => {
                    this._image = image;
                    resolve(image);
                }).catch(error => {
                    reject(error);
                });
            }
        });
    }
}