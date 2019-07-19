import { WordDocument } from "../word-document.js";
import { Package } from "../package/package.js";
import { Xml } from "../xml.js";

export class Picture {
    private _pack: Package;
    private _name: string;
    private _imageUrl: string | undefined;

    public static fromPicNode(picNode: ChildNode, doc: WordDocument): Picture | undefined {
        let run: Picture | undefined = undefined;
        const blipFill = Xml.getFirstChildOfName(picNode, "pic:blipFill");
        if (blipFill !== undefined) {
            const blip = Xml.getFirstChildOfName(blipFill, "a:blip");
            if (blip !== undefined) {
                const relId = Xml.getAttribute(blip, "r:embed");
                let target: string | undefined = undefined;
                if (doc.relationships !== undefined && relId !== undefined) {
                    target = doc.relationships.getTarget(relId);
                    run = new Picture(doc.pack, `word/${target}`);
                }
            }
        }
        return run;
    }

    constructor(pack: Package, name: string) {
        this._pack = pack;
        this._name = name;
    }

    public getImageUrl(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (this._imageUrl !== undefined) {
                resolve(this._imageUrl);
            } else {
                this._pack.loadImageUrl(this._name).then(imageUrl => {
                    this._imageUrl = imageUrl;
                    resolve(this._imageUrl);
                }).catch(error => {
                    reject(error);
                });
            }
        });
    }
}