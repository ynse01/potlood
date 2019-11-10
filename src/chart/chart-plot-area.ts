import { ChartAxis } from "./chart-axis.js";
import { ChartStyle } from "./chart-style.js";
import { Rectangle } from "../utils/rectangle.js";

export class ChartPlotArea {
    public style = new ChartStyle();
    public valueAxis: ChartAxis | undefined;
    public categoryAxis: ChartAxis | undefined;
    public bounds: Rectangle = new Rectangle(0, 0, 0, 0);

    public performLayout(): void {
        
    }
}