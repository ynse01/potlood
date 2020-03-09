import { MathObject, MathObjectList } from "./math-object.js";
import { IPainter } from "../painting/i-painter.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { MatrixStyle } from "./matrix-style.js";
import { Box } from "../utils/math/box.js";

export class MatrixObject extends MathObject {
    public rows: MathObjectList;
    public style: MatrixStyle;

    constructor(rows: MathObjectList, style: MatrixStyle) {
        super();
        this.rows = rows;
        this.style = style;
    }

    public  getBoundingBox(): Box {
        const rowBox = this.rows.get(0).getBoundingBox();
        rowBox.height *= this.rows.length;
        return rowBox;
    }

    public performLayout(_flow: VirtualFlow): void {
        throw new Error("Method not implemented.");
    }
    
    public render(_painter: IPainter): void {
        throw new Error("Method not implemented.");
    }
}