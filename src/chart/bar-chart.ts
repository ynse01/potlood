import { ChartSeries } from "./chart-series.js";
import { ChartValue } from "./chart-value.js";
import { ChartSpace } from "./chart-space.js";

export class BarChart {
    public series: ChartSeries[] = [];
    public space: ChartSpace;

    constructor(space: ChartSpace) {
        this.space = space;
    }

    public getCounts(): {numCats: number, numValues: number, numSeries: number} {
        return {
            numCats: this.series[0].categories.length,
            numValues: this.series[0].values.length,
            numSeries: this.series.length
        };
    }

    public getValue(catIndex: number, seriesIndex: number): ChartValue {
        return this.series[seriesIndex].values[catIndex];
    }

    public getValueRange(): { max: number, min: number } {
        let max = Number.MIN_VALUE;
        let min = Number.MAX_VALUE;
        this.series.forEach(series => {
            series.values.forEach(val => {
                const num = val.numeric;
                if (num !== undefined) {
                    max = Math.max(max, num);
                    min = Math.min(min, num);
                }
            });
        });
        return { max: max, min: min};
    }

    public getColor(seriesIndex: number): string {
        return this.series[seriesIndex].color;
    }
}