import { MathObject } from "./math-object.js";
import { IPainter } from "../painting/i-painter.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { Size } from "../utils/math/size.js";
import { Point } from "../utils/math/point.js";
import { Style } from "../text/style.js";
import { FontMetrics } from "../utils/font-metrics.js";
import { Justification } from "../paragraph/par-style.js";

export class CharacterObject extends MathObject {
    private _char: string;
    private _style: Style;
    private _pos: Point | undefined;

    constructor(char: string, style: Style) {
        super();
        this._char = char;
        this._style = style;
    }

    public getSize(): Size {
        const height = this._style.lineSpacing;
        return new Size(this._getWidth(), height);
    }
    
    public performLayout(flow: VirtualFlow, xPadding: number): number {
        this._pos = new Point(flow.getX() + xPadding, flow.getY());
        return xPadding + this._getWidth();
    }
    
    public render(painter: IPainter): void {
        if (this._pos !== undefined) {
            painter.paintText(this._pos.x, this._pos.y, 100, false, this._char, this._style.color, Justification.left, this._style.fontFamily, this._style.fontSize, this._style.bold, this._style.italic);
        }
    }

    private _getWidth(): number {
        return FontMetrics.averageCharWidth(this._style) * this._char.length;
    }
}