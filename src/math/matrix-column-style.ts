import { MatrixColumnXAlign } from "./matrix-style.js";

export class MatrixColumnStyle {
    public count: number = 0;
    public justification: MatrixColumnXAlign = MatrixColumnXAlign.Center;

    public setJustification(jcStr: string | undefined): void {
        switch (jcStr) {
            case "left":
                this.justification = MatrixColumnXAlign.Left;
                break;
            case "right":
                this.justification = MatrixColumnXAlign.Right;
                break;
            case "inside":
                this.justification = MatrixColumnXAlign.Inside;
                break;
            case "outside":
                this.justification = MatrixColumnXAlign.Outside;
                break;
            case "center":
            default:
                this.justification = MatrixColumnXAlign.Center;
                break;
        }
    }
}
