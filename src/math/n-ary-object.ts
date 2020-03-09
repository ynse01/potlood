import { VirtualFlow } from "../utils/virtual-flow.js";
import { MathObject } from "./math-object.js";
import { NAryStyle } from "./n-ary-style.js";
import { IPainter } from "../painting/i-painter.js";
import { Box } from "../utils/math/box.js";

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

    public  getBoundingBox(): Box {
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
        if (!this._style.hideSub && this._sub !== undefined) {
            this._sub.performLayout(flow);
        }
        if (!this._style.hideSuper && this._super !== undefined) {
            this._super.performLayout(flow);
        }
        if (this._elem !== undefined) {
            this._elem.performLayout(flow);
        }
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
