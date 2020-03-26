import { MathObject } from "./math-object.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { IPainter } from "../painting/i-painter.js";
import { RadicalStyle } from "./radical-style.js";
import { Size } from "../utils/geometry/size.js";
import { CharacterObject } from "./character-object.js";
import { Style } from "../text/style.js";

export class RadicalObject extends MathObject {
    private _degree: MathObject | undefined;
    private _elem: MathObject | undefined;
    private _radical: MathObject;
    public style: RadicalStyle;

    constructor(degree: MathObject | undefined, elem: MathObject | undefined, style: RadicalStyle) {
        super();
        this._degree = degree;
        this._elem = elem;
        this._radical = new CharacterObject("U0x221A", new Style());
        this.style = style;
    }

    public getSize(): Size {
        let elemSize : Size;
        if (this._elem !== undefined) {
            elemSize = this._elem.getSize();
        } else {
            elemSize = new Size(0, 0);
        }
        elemSize.width += 20;
        elemSize.height += 20;
        return elemSize;
    }

    public performLayout(flow: VirtualFlow, xPadding: number): number {
        let padding = xPadding;
        padding = this._degree?.performLayout(flow, padding) || padding;
        padding = this._radical?.performLayout(flow, padding) || padding;
        padding = this._elem?.performLayout(flow, padding) || padding;
        return padding;
    }
    
    public render(painter: IPainter): void {
        this._degree?.render(painter);
        this._radical?.render(painter);
        this._elem?.render(painter);
    }   
}