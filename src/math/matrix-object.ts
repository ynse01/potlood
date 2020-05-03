import { MathObject, MathObjectList } from "./math-object";
import { IPainter } from "../painting/i-painter";
import { VirtualFlow } from "../utils/virtual-flow";
import { MatrixStyle } from "./matrix-style";
import { Size } from "../utils/geometry/size";

export class MatrixObject extends MathObject {
    public rows: MathObjectList;
    public style: MatrixStyle;

    constructor(rows: MathObjectList, style: MatrixStyle) {
        super();
        this.rows = rows;
        this.style = style;
    }

    public getSize(): Size {
        const rowSize = this.rows.get(0).getSize().clone();
        rowSize.height = (rowSize.height + 20) * this.rows.length - 20;
        return rowSize;
    }

    public performLayout(_flow: VirtualFlow, _xPadding: number): number {
        throw new Error("Method not implemented.");
    }
    
    public render(_painter: IPainter): void {
        throw new Error("Method not implemented.");
    }
}