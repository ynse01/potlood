
export enum TableBorderType {
    none = "none",
    single = "single",
    dashDotStroked = "dashDotStroked",
    dashed = "dashed",
    dashSmallGap = "dashSmallGap",
    dotDash = "dotDash",
    dotDotDash = "dotDotDash",
    dotted = "dotted",
    double = "double",
    doubleWave = "doubleWave",
    inset = "inset",
    nil = "nil",
    outset = "outset",
    thick = "thick",
    thickThinLargeGap = "thickThinLargeGap",
    thickThinMediumGap = "thickThinMediumGap",
    thickThinSmallGap = "thickThinSmallGap",
    thinThickLargeGap = "thinThickLargeGap",
    thinThickMediumGap = "thinThickMediumGap",
    thinThickSmallGap = "thinThickSmallGap",
    thinThickThinLargeGap = "thinThickThinLargeGap",
    thinThickThinMediumGap = "thinThickThinMediumGap",
    thinThickThinSmallGap = "thinThickThinSmallGap",
    threeDEmboss = "threeDEmboss",
    threeDEngrave = "threeDEngrave",
    triple = "triple",
    wave = "wave"
}

export class TableBorder {
    public type: TableBorderType;
    public size: number;
    public spacing: number;
    public color: string;

    constructor() {
        this.type = TableBorderType.none;
        this.size = 0;
        this.spacing = 0;
        this.color = "000000";
    }
}
