import { ChartSeries } from "./chart-series.js";
import { ChartValue } from "./chart-value.js";
import { ChartSpace } from "./chart-space.js";
export declare class BarChart {
    series: ChartSeries[];
    space: ChartSpace;
    constructor(space: ChartSpace);
    getValueBounds(): {
        numCats: number;
        numValues: number;
        numSeries: number;
    };
    getValue(catIndex: number, seriesIndex: number): ChartValue;
    getValueRange(): {
        max: number;
        min: number;
    };
    getColor(seriesIndex: number): string;
}
