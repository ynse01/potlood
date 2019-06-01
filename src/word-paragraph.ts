import { Xml } from "./xml.js";

export class WordParagraph {
    private pNode: ChildNode;
    private txts: string[] | undefined;

    constructor(pNode: ChildNode) {
        this.pNode = pNode;
        this.txts = undefined;
    }

    public get texts(): string[] {
        if (this.txts === undefined) {
            const texts: string[] = [];
            Xml.getChildrenOfName(this.pNode, "w:t").forEach(node => {
                const content = node.textContent;
                if (content !== null) {
                    texts.push(content);
                }
            });
            this.txts = texts;
        }
        return this.txts;
    }
}