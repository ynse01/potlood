import { VirtualFlow } from "../utils/virtual-flow.js";
import { MathObject } from "./math-object.js";
import { NAryStyle } from "./n-ary-style.js";
import { IPainter } from "../painting/i-painter.js";
import { Size } from "../utils/math/size.js";

export class NAryObject extends MathObject {
    private _sub: MathObject | undefined;
    private _super: MathObject | undefined;
    private _elem: MathObject | undefined;
    private _style: NAryStyle;

    constructor(sub: MathObject | undefined, sup: MathObject | undefined, elem: MathObject | undefined, style: NAryStyle) {
        super();
        this._sub = sub;
        this._super = sup;
        this._elem = elem;
        this._style = style;
    }

    public getSize(): Size {
        let elemSize = (this._elem !== undefined)  ? this._elem.getSize() : new Size(0, 0);
        let superSize = (this._super !== undefined)  ? this._super.getSize() : new Size(0, 0);
        let subSize = (this._sub !== undefined)  ? this._sub.getSize() : new Size(0, 0);
        const size = superSize.addVertical(elemSize).addVertical(subSize);
        return size;
    }

    public performLayout(flow: VirtualFlow): void {
        this._sub?.performLayout(flow);
        this._super?.performLayout(flow);
        this._elem?.performLayout(flow);
    }
    
    public render(painter: IPainter): void {
        if (!this._style.hideSub && this._sub !== undefined) {
            this._sub.render(painter);
        }
        if (!this._style.hideSuper && this._super !== undefined) {
            this._super.render(painter);
        }
        if (this._elem !== undefined) {
            this._elem.render(painter);
        }
    }
}
