import { ChartSpace } from "./chart-space.js";
import { BaseChart } from "./base-chart.js";

export enum ChartOrientation {
    Horizontal,
    Vertical
}

export class BarChart extends BaseChart {
    public orientation = ChartOrientation.Horizontal;
    constructor(space: ChartSpace) {
        super(space);
    }

}