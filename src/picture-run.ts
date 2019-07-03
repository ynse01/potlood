import { WordDocument } from "./word-document.js";
import { Package } from "./package.js";
import { Xml } from "./xml.js";

export class PictureRun {
    public image: HTMLImageElement;

    public static fromPicNode(picNode: ChildNode, pack: Package, wordDoc: WordDocument): Promise<PictureRun> {
        return new Promise((resolve, reject) => {
            const blib = Xml.getChildrenOfName(picNode, "blib");
            if (blib !== undefined && blib.length > 0) {
                const relId = Xml.getAttribute(blib[0], "r:embed");
                let target: string | undefined = undefined;
                if (wordDoc.relationships !== undefined && relId !== undefined) {
                    target = wordDoc.relationships.getTarget(relId);
                }
                if (target !== undefined) {
                    pack.loadImage(target).then(image => {
                        resolve(new PictureRun(image));
                    });
                } else {
                    reject(`Failed to find location to load image from.`);
                }
            } else {
                reject("Failed to find image to load");
            }
        });
    }

    constructor(image: HTMLImageElement) {
        this.image = image;
    }
}