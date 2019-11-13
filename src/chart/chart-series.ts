import { ChartValue } from "./chart-value.js";

export class ChartSeries {
    public categories: ChartValue[] = [];
    public values: ChartValue[] = [];
    public color: string = "";
    public name: string = "";

    public get hasNumericValues(): boolean {
        return this.values.length > 0 && this.values[0].numeric !== undefined;
    }

    public get hasNumericCategories(): boolean {
        return this.categories.length > 0 && this.categories[0].numeric !== undefined;
    }
}