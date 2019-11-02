import { ChartSpace } from "./chart-space.js";
export declare class ChartReader {
    static readChartFromNode(chartSpaceNode: Node, space: ChartSpace): ChartSpace;
    private static _readPlotArea;
    private static _readLegend;
    private static _readBarChart;
    private static _readStyle;
    private static _readChartAxis;
    private static _readChartSeries;
    private static _readStringReference;
    private static _readNumericReference;
    private static _readFillColor;
    private static _parseTickMode;
    private static _parsePosition;
    private static _parseLabelAlignment;
    private static _parseCrossMode;
}
