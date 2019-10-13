
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

export class ChartAxis {
    public position: ChartAxisPosition;
    public majorTickMode: ChartAxisTickMode;
    public minorTickMode: ChartAxisTickMode;
    public labelAlignment: ChartAxisLabelAlignment;
    public labelOffset: number;

    constructor(pos: ChartAxisPosition, major: ChartAxisTickMode, minor: ChartAxisTickMode, alignment: ChartAxisLabelAlignment, offset: number) {
        this.position = pos;
        this.majorTickMode = major;
        this.minorTickMode = minor;
        this.labelAlignment = alignment;
        this.labelOffset = offset;
    }
}