import { MathObject, MathObjectList } from "./math-object.js";
import { IPainter } from "../painting/i-painter.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { MatrixStyle } from "./matrix-style.js";

export class MatrixObject extends MathObject {
    public rows: MathObjectList;
    public style: MatrixStyle;

    constructor(rows: MathObjectList, style: MatrixStyle) {
        super();
        this.rows = rows;
        this.style = style;
    }

    public performLayout(_flow: VirtualFlow): void {
        throw new Error("Method not implemented.");
    }
    
    public render(_painter: IPainter): void {
        throw new Error("Method not implemented.");
    }
}