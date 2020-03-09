import { MathObject } from "./math-object.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { IPainter } from "../painting/i-painter.js";
import { RadicalStyle } from "./radical-style.js";
import { Box } from "../utils/math/box.js";

export class RadicalObject extends MathObject {
    private _degree: MathObject | undefined;
    private _elem: MathObject | undefined;
    public style: RadicalStyle;

    constructor(degree: MathObject | undefined, elem: MathObject | undefined, style: RadicalStyle) {
        super();
        this._degree = degree;
        this._elem = elem;
        this.style = style;
    }

    public getBoundingBox(): Box {
        let elemBox : Box;
        if (this._elem !== undefined) {
            elemBox = this._elem.getBoundingBox();
        } else {
            elemBox = new Box(0, 0, 0, 0);
        }
        elemBox.width += 20;
        elemBox.height += 20;
        elemBox.y = -20;
        return elemBox;
    }

    public performLayout(flow: VirtualFlow): void {
        this._degree?.performLayout(flow);
        this._elem?.performLayout(flow);
    }
    
    public render(_painter: IPainter): void {
        throw new Error("Method not implemented.");
    }   
}