import { BarChart } from "./bar-chart.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { IPainter } from "../painting/i-painter.js";
export declare class ChartRenderer {
    private _painter;
    constructor(painter: IPainter);
    renderBarChart(barChart: BarChart, flow: VirtualFlow, width: number, height: number): void;
}
