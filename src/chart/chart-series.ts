import { ChartValue } from "./chart-value.js";

export class ChartSeries {
    public categories: ChartValue[] = [];
    public values: ChartValue[] = [];
    public color: string = "";
    public name: string = "";
}