
export enum ChartAxisPosition {
    Top,
    Bottom,
    Left,
    Right
}

export enum ChartAxisTickMode {
    None,
    Outwards
}

export enum ChartAxisLabelAlignment {
    Center
}

export enum ChartAxisCrossMode {
    AutoZero
}

export class ChartAxis {
    public position: ChartAxisPosition;
    public majorTickMode: ChartAxisTickMode;
    public minorTickMode: ChartAxisTickMode;
    public labelAlignment: ChartAxisLabelAlignment = ChartAxisLabelAlignment.Center;
    public labelOffset: number;
    public crossMode: ChartAxisCrossMode = ChartAxisCrossMode.AutoZero;

    constructor(pos: ChartAxisPosition, major: ChartAxisTickMode, minor: ChartAxisTickMode, offset: number) {
        this.position = pos;
        this.majorTickMode = major;
        this.minorTickMode = minor;
        this.labelOffset = offset;
    }
}