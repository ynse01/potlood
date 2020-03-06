import { TextRun } from "../text/text-run.js";
import { NumberingStyle } from "./num-style.js";
import { Style } from "../text/style.js";
import { VirtualFlow } from "../utils/virtual-flow.js";

export class NumberingRun extends TextRun {
    private _style: NumberingStyle;

    constructor(style: NumberingStyle) {
        super([""], style.style || new Style());
        this._style = style;
    }

    public performLayout(flow: VirtualFlow): void {
        const indices = this._getIndices(flow);
        super.texts = [this._style.getPrefixText(indices)];
        this._advanceIndex(flow);
        super.performLayout(flow);
    }

    private _getIndices(flow: VirtualFlow): number[] {
        const indices: number[] = [];
        const numId = this._style.numId;
        const level = this._style.level;
        if (level !== undefined) {
            const maxIndex = level.index;
            for(let i = 0; i <= maxIndex; i++) {
                indices.push(flow.getNumbering(numId, i));
            }
        } else {
            indices.push(0);
        }
        return indices;
    }

    private _advanceIndex(flow: VirtualFlow): void {
        const numId = this._style.numId;
        const level = this._style.level;
        let levelIndex = 0;
        if (level !== undefined) {
            levelIndex = level.index;
        }
        flow.advanceNumbering(numId, levelIndex);
    }
}