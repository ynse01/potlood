import { MathObject } from "./math-object.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { IPainter } from "../painting/i-painter.js";
import { DelimiterStyle } from "./delimiter-style.js";
import { Size } from "../utils/math/size.js";

export class DelimiterObject extends MathObject {
    private _elem: MathObject | undefined;
    private _style: DelimiterStyle;

    constructor(elem: MathObject | undefined, style: DelimiterStyle) {
        super();
        this._elem = elem;
        this._style = style;
    }

    public getSize(): Size {
        let elemSize: Size;
        if (this._elem !== undefined) {
            elemSize = this._elem.getSize();
        } else {
            elemSize = new Size(0, 0);
        }
        const size = elemSize.clone();
        size.width += 20;
        return size;
    }
    
    public performLayout(flow: VirtualFlow): void {
        this._elem?.performLayout(flow);
    }
    
    public render(painter: IPainter): void {
        if (this._style.beginChar !== "" && this._style.endChar !== "")
        this._elem?.render(painter);
    }
}
