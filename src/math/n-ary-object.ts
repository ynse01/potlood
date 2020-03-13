import { VirtualFlow } from "../utils/virtual-flow.js";
import { MathObject } from "./math-object.js";
import { NAryStyle } from "./n-ary-style.js";
import { IPainter } from "../painting/i-painter.js";
import { Size } from "../utils/math/size.js";
import { CharacterObject } from "./character-object.js";
import { Style } from "../text/style.js";

export class NAryObject extends MathObject {
    private _sub: MathObject | undefined;
    private _super: MathObject | undefined;
    private _elem: MathObject | undefined;
    private _char: MathObject;
    private _style: NAryStyle;

    constructor(sub: MathObject | undefined, sup: MathObject | undefined, elem: MathObject | undefined, style: NAryStyle) {
        super();
        this._sub = sub;
        this._super = sup;
        this._elem = elem;
        this._char = new CharacterObject(style.char, new Style());
        this._style = style;
    }

    public getSize(): Size {
        let elemSize = (this._elem !== undefined)  ? this._elem.getSize() : new Size(0, 0);
        let superSize = (this._super !== undefined)  ? this._super.getSize() : new Size(0, 0);
        let subSize = (this._sub !== undefined)  ? this._sub.getSize() : new Size(0, 0);
        const size = superSize.addVertical(elemSize).addVertical(subSize);
        return size;
    }

    public performLayout(flow: VirtualFlow, xPadding: number): number {
        if (this._sub !== undefined && !this._style.hideSub) {
            this._sub.performLayout(flow, xPadding);
        }
        if (this._super !== undefined && !this._style.hideSuper) {
            this._super.performLayout(flow, xPadding);
        }
        let padding = xPadding;
        padding = this._char.performLayout(flow, padding) || padding;
        padding = this._elem?.performLayout(flow, padding) || padding;
        return padding;
    }
    
    public render(painter: IPainter): void {
        if (this._sub !== undefined && !this._style.hideSub) {
            this._sub.render(painter);
        }
        if (this._super !== undefined && !this._style.hideSuper) {
            this._super.render(painter);
        }
        this._char.render(painter);
        this._elem?.render(painter);
    }
}
