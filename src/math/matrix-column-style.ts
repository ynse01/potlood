import { MatrixColumnXAlign } from "./matrix-style.js";

export class MatrixColumnStyle {
    public count: number = 0;
    public justification: MatrixColumnXAlign = MatrixColumnXAlign.Left;

    public setJustification(jcStr: string | undefined): void {
        switch (jcStr) {
            case "center":
            case "right":
            case "inside":
            case "outside":
            case "left":
            default:
                break;
        }
    }
}
