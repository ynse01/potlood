import { BarChart } from "./bar-chart.js";
import { ChartStyle } from "./chart-style.js";
import { ChartPlotArea } from "./chart-plot-area.js";
import { ChartLegend } from "./chart-legend.js";
export declare class ChartSpace {
    private _promise;
    private _barChart;
    style: ChartStyle;
    plotArea: ChartPlotArea;
    legend: ChartLegend | undefined;
    ensureLoaded(): Promise<void>;
    readonly barChart: BarChart | undefined;
    setBarChart(barChart: BarChart): void;
    setPromise(promise: Promise<void>): void;
}
