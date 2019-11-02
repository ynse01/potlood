export declare enum ChartAxisPosition {
    Top = 0,
    Bottom = 1,
    Left = 2,
    Right = 3
}
export declare enum ChartAxisTickMode {
    None = 0,
    Outwards = 1
}
export declare enum ChartAxisLabelAlignment {
    Center = 0
}
export declare enum ChartAxisCrossMode {
    AutoZero = 0
}
export declare class ChartAxis {
    position: ChartAxisPosition;
    majorTickMode: ChartAxisTickMode;
    minorTickMode: ChartAxisTickMode;
    labelAlignment: ChartAxisLabelAlignment;
    labelOffset: number;
    crossMode: ChartAxisCrossMode;
    constructor(pos: ChartAxisPosition, major: ChartAxisTickMode, minor: ChartAxisTickMode, offset: number);
}
