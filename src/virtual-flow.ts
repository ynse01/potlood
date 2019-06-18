import { WordDocument } from "./word-document.js";

export class VirtualFlow {
    private _width: number;

    constructor(content: Element, _doc: WordDocument) {
        this._width = content.clientWidth;
    }

    public getWidth(_flowPos: number): number {
        return this._width;
    }
}