import { MathObject } from "./math-object.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { IPainter } from "../painting/i-painter.js";
import { FunctionStyle } from "./function-style.js";
import { Box } from "../utils/math/box.js";

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

    public getBoundingBox(): Box {
        let elemBox: Box;
        if (this._elem !== undefined) {
            elemBox = this._elem?.getBoundingBox();
        } else {
            elemBox = new Box(0, 0, 0, 0);
        }
        let nameBox: Box;
        if (this._functionName !== undefined) {
            nameBox = this._functionName?.getBoundingBox();
        } else {
            nameBox = new Box(0, 0, 0, 0);
        }
        const box = elemBox.clone();
        box.width = box.width + nameBox.width;
        box.height = Math.max(box.height, nameBox.height);
        return box;
    }
    
    public performLayout(flow: VirtualFlow): void {
        this._functionName?.performLayout(flow);
        this._elem?.performLayout(flow);
    }
    
    public render(_painter: IPainter): void {
        throw new Error("Method not implemented.");
    }   
}