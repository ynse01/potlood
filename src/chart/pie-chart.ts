import { ChartSpace } from "./chart-space.js";
import { BaseChart } from "./base-chart.js";

export class PieChart extends BaseChart {
    public startAngle: number;

    constructor(space: ChartSpace) {
        super(space);
        this.startAngle = 0;
    }

}