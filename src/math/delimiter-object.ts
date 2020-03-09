import { MathObject } from "./math-object.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { IPainter } from "../painting/i-painter.js";
import { DelimiterStyle } from "./delimiter-style.js";
import { Box } from "../utils/math/box.js";

export class DelimiterObject extends MathObject {
    private _elem: MathObject | undefined;
    private _style: DelimiterStyle;

    constructor(elem: MathObject | undefined, style: DelimiterStyle) {
        super();
        this._elem = elem;
        this._style = style;
    }

    public getBoundingBox(): Box {
        let elemBox: Box;
        if (this._elem !== undefined) {
            elemBox = this._elem?.getBoundingBox();
        } else {
            elemBox = new Box(0, 0, 0, 0);
        }
        const box = elemBox.clone();
        box.width += 20;
        return box;
    }
    
    public performLayout(flow: VirtualFlow): void {
        this._elem?.performLayout(flow);
    }
    
    public render(painter: IPainter): void {
        if (this._style.beginChar !== "" && this._style.endChar !== "")
        this._elem?.render(painter);
    }
}
