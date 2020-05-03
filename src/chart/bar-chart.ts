import { ChartSpace } from "./chart-space";
import { BaseChart } from "./base-chart";

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