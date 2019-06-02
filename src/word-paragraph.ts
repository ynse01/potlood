import { Xml } from "./xml.js";
import { WordRun } from "./word-run.js";

export class WordParagraph {
    private pNode: ChildNode;
    private _texts: string[] | undefined;
    private _runs: WordRun[] | undefined;

    constructor(pNode: ChildNode) {
        this.pNode = pNode;
        this._texts = undefined;

    }

    public get runs(): WordRun[] {
        if (this._runs === undefined) {
            const runs: WordRun[] = [];
            Xml.getChildrenOfName(this.pNode, "w:r").forEach(node => {
                runs.push(new WordRun(node));
            });
            this._runs = runs;
        }
        return this._runs;
    }

    public get texts(): string[] {
        if (this._texts === undefined) {
            const texts: string[] = [];
            Xml.getChildrenOfName(this.pNode, "w:t").forEach(node => {
                const content = node.textContent;
                if (content !== null) {
                    texts.push(content);
                }
            });
            this._texts = texts;
        }
        return this._texts;
    }
}