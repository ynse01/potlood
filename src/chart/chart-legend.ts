import { ChartStyle } from "./chart-style.js";
import { ChartAxisPosition } from "./chart-axis.js";

export class ChartLegend {
    public style: ChartStyle = new ChartStyle();
    public position: ChartAxisPosition = ChartAxisPosition.Right;
    public overlayOnPlot: boolean = false;
}