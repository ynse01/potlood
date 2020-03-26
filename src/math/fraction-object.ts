import { MathObject } from "./math-object.js";
import { IPainter } from "../painting/i-painter.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { FractionStyle } from "./fraction-style.js";
import { Size } from "../utils/geometry/size.js";

export class FractionObject extends MathObject {
    private _numerator: MathObject | undefined;
    private _denumerator: MathObject | undefined;
    public style: FractionStyle;

    constructor(numerator: MathObject | undefined, denumerator: MathObject | undefined, style: FractionStyle) {
        super();
        this._numerator = numerator;
        this._denumerator = denumerator;
        this.style = style;
    }

    public getSize(): Size {
        let denominatorSize: Size;
        if (this._denumerator !== undefined) {
            denominatorSize = this._denumerator.getSize();
        } else {
            denominatorSize = new Size(0, 0);
        }
        let numeratorSize: Size;
        if (this._numerator !== undefined) {
            numeratorSize = this._numerator.getSize();
        } else {
            numeratorSize = new Size(0, 0);
        }
        return denominatorSize.addVertical(numeratorSize, 20);
    }
    
    public performLayout(flow: VirtualFlow, xPadding: number): number {
        const numPadding = this._numerator?.performLayout(flow, xPadding) || xPadding;
        const denPadding = this._denumerator?.performLayout(flow, xPadding) || xPadding;
        return Math.max(numPadding, denPadding);
    }
    
    public render(painter: IPainter): void {
        this._numerator?.render(painter);
        this._denumerator?.render(painter);
    }   
}