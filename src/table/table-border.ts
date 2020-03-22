
export enum TableBorderType {
    None,
    Single,
    DashDotStroked,
    Dashed,
    DashSmallGap,
    DotDash,
    DotDotDash,
    Dotted,
    Double,
    DoubleWave,
    Inset,
    Outset,
    Thick,
    ThickThinLargeGap,
    ThickThinMediumGap,
    ThickThinSmallGap,
    ThinThickLargeGap,
    ThinThickMediumGap,
    ThinThickSmallGap,
    ThinThickThinLargeGap,
    ThinThickThinMediumGap,
    ThinThickThinSmallGap,
    Emboss3D,
    Engrave3D,
    Triple,
    Wave
}

export class TableBorder {
    public type: TableBorderType;
    public size: number;
    public spacing: number;
    public color: string;

    constructor() {
        this.type = TableBorderType.None;
        this.size = 1;
        this.spacing = 0;
        this.color = "000000";
    }
}
