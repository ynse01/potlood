import { MathObject } from "./math-object.js";
import { IPainter } from "../painting/i-painter.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { FractionStyle } from "./fraction-style.js";
import { Box } from "../utils/math/box.js";

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

    public  getBoundingBox(): Box {
        let denominatorBox : Box;
        if (this._denumerator !== undefined) {
            denominatorBox = this._denumerator.getBoundingBox();
        } else {
            denominatorBox = new Box(0, 0, 0, 0);
        }
        let numeratorBox : Box;
        if (this._numerator !== undefined) {
            numeratorBox = this._numerator.getBoundingBox();
        } else {
            numeratorBox = new Box(0, 0, 0, 0);
        }
        const box = denominatorBox.clone();
        box.width = Math.max(denominatorBox.width, numeratorBox.width);
        box.height = 20 + denominatorBox.height + numeratorBox.height;
        return box;
    }
    
    public performLayout(flow: VirtualFlow): void {
        this._numerator?.performLayout(flow);
        this._denumerator?.performLayout(flow);
    }
    
    public render(painter: IPainter): void {
        this._numerator?.render(painter);
        this._denumerator?.render(painter);
    }   
}