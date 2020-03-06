
export enum MatrixJustification {
    Inline,
    Top,
    Center,
    Bottom,
    Inside,
    Outside
}

export enum MatrixSpacingRule {
    Single,
    OneAndAHalf,
    Two,
    Exactly,
    Multiple
}

export class MatrixStyle {
    public baseJustification: MatrixJustification = MatrixJustification.Inline;
    public hidePlaceholder: boolean = false;
    public rowSpacingRule: MatrixSpacingRule = MatrixSpacingRule.Single;
    public rowSpacing: number = 1;
    public columnGapRule: MatrixSpacingRule = MatrixSpacingRule.Single;
    public columnGap: number = 1;
    public columnMinimalWidth: number = 1;

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