import { ChartSpace } from "./chart-space.js";
import { BaseChart } from "./base-chart.js";

export class PieChart extends BaseChart {
    public startAngle: number;

    constructor(space: ChartSpace) {
        super(space);
        this.startAngle = 0;
    }

    public getValueSum(seriesIndex: number): number {
        const values = this.series[seriesIndex].values;
        let count = 0;
        for (let i = 0; i < values.length; i++) {
            const numeric = values[i].numeric;
            if (numeric !== undefined) {
                count += numeric;
            }
        }
        return count;
    }
}