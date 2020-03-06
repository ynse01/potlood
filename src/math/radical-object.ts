import { MathObject } from "./math-object.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { IPainter } from "../painting/i-painter.js";
import { RadicalStyle } from "./radical-style.js";

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

    public performLayout(flow: VirtualFlow): void {
        this._degree?.performLayout(flow);
        this._elem?.performLayout(flow);
    }
    
    public render(_painter: IPainter): void {
        throw new Error("Method not implemented.");
    }   
}