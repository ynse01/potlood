import { MathObject } from "./math-object.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { IPainter } from "../painting/i-painter.js";
import { FunctionStyle } from "./function-style.js";

export class FunctionObject extends MathObject {
    private _functionName: MathObject | undefined;
    private _elem: MathObject | undefined;
    public style: FunctionStyle;

    constructor(functionName: MathObject | undefined, elem: MathObject | undefined, style: FunctionStyle) {
        super();
        this._functionName = functionName;
        this._elem = elem;
        this.style = style;
    }

    public performLayout(flow: VirtualFlow): void {
        this._functionName?.performLayout(flow);
        this._elem?.performLayout(flow);
    }
    
    public render(_painter: IPainter): void {
        throw new Error("Method not implemented.");
    }   
}