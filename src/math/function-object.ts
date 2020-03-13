import { MathObject } from "./math-object.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { IPainter } from "../painting/i-painter.js";
import { FunctionStyle } from "./function-style.js";
import { Size } from "../utils/math/size.js";

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

    public getSize(): Size {
        let elemSize: Size;
        if (this._elem !== undefined) {
            elemSize = this._elem.getSize();
        } else {
            elemSize = new Size(0, 0);
        }
        let nameSize: Size;
        if (this._functionName !== undefined) {
            nameSize = this._functionName.getSize();
        } else {
            nameSize = new Size(0, 0);
        }
        const size = nameSize.addVertical(elemSize);
        return size;
    }
    
    public performLayout(flow: VirtualFlow): void {
        this._functionName?.performLayout(flow);
        this._elem?.performLayout(flow);
    }
    
    public render(painter: IPainter): void {
        this._functionName?.render(painter);
        this._elem?.render(painter);
    }   
}