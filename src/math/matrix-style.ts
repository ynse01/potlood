
export enum MatrixJustification {
    Inline,
    Top,
    Center,
    Bottom,
    Inside,
    Outside
}

export class MatrixStyle {
    public baseJustification: MatrixJustification = MatrixJustification.Inline;
    public hidePlaceholder: boolean = false;
    public rowSpacing: number = 1;
    public columnSpacing: number = 1;

    public setJustification(jcStr: string | undefined): void {
        switch (jcStr) {
            case "inline":
            case "top":
            case "center":
            case "bottom":
            case "inside":
            case "outside":
                break;
        }
    }
}