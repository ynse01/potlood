import { ChartValue } from "./chart-value";
import { ChartStyle } from "./chart-style";

export class ChartSeries {
    public categories: ChartValue[] = [];
    public values: ChartValue[] = [];
    public style: ChartStyle = new ChartStyle();
    public name: string = "";

    public get hasNumericValues(): boolean {
        return this.values.length > 0 && this.values[0].numeric !== undefined;
    }

    public get hasNumericCategories(): boolean {
        return this.categories.length > 0 && this.categories[0].numeric !== undefined;
    }
}