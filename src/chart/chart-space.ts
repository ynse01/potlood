import { BarChart } from "./bar-chart.js";
import { ChartAxis } from "./chart-axis.js";

export class ChartSpace {
    private _promise: Promise<void> | undefined = undefined;
    private _barChart: BarChart | undefined = undefined;
    public valueAxis: ChartAxis | undefined;
    public categoryAxis: ChartAxis | undefined;

    public async ensureLoaded(): Promise<void> {
        if (this._promise !== undefined) {
            await this._promise;
            this._promise = undefined;
        }
    }

    public get barChart(): BarChart | undefined {
        return this._barChart;
    }

    public setBarChart(barChart: BarChart): void {
        this._barChart = barChart;
    }

    public setPromise(promise: Promise<void>): void {
        this.ensureLoaded();
        this._promise = promise;
    }
}