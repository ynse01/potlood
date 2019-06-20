import { WordDocument } from "./word-document.js";
import { FlowPosition } from "./flow-position.js";

export class VirtualFlow {
    private _width: number;

    constructor(content: Element, _doc: WordDocument) {
        this._width = content.clientWidth - 2 * 40;
    }

    public getX(_flowPos: FlowPosition): number {
        return 40;
    }

    public getWidth(_flowPos: FlowPosition): number {
        return this._width;
    }
}