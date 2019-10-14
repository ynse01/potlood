import { ChartAxis } from "./chart-axis.js";
import { ChartStyle } from "./chart-style.js";

export class ChartPlotArea {
    public style = new ChartStyle();
    public valueAxis: ChartAxis | undefined;
    public categoryAxis: ChartAxis | undefined;
}