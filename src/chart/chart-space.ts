import { BarChart } from "./bar-chart.js";
import { ChartStyle } from "./chart-style.js";
import { ChartPlotArea } from "./chart-plot-area.js";
import { ChartLegend } from "./chart-legend.js";
import { ILayoutable } from "../utils/i-layoutable.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { Rectangle } from "../utils/rectangle.js";
import { Style } from "../text/style.js";
import { ChartAxisPosition } from "./chart-axis.js";

export class ChartSpace implements ILayoutable {
    private _promise: Promise<void> | undefined = undefined;
    private _barChart: BarChart | undefined = undefined;
    public style: ChartStyle = new ChartStyle();
    public textStyle: Style = new Style();
    public plotArea: ChartPlotArea = new ChartPlotArea();
    public legend: ChartLegend | undefined = undefined;
    public bounds: Rectangle = new Rectangle(0, 0, 0, 0);

    constructor() {
        // Hard coded text style.
        this.textStyle.runStyle.updateFont("Times New Roman", false, 11);
    }

    public async ensureLoaded(): Promise<void> {
        if (this._promise !== undefined) {
            await this._promise;
            this._promise = undefined;
        }
    }

    public get barChart(): BarChart | undefined {
        return this._barChart;
    }

    public setBarChart(barChart: BarChart): void {
        this._barChart = barChart;
    }

    public setPromise(promise: Promise<void>): void {
        this.ensureLoaded();
        this._promise = promise;
    }

    public performLayout(_flow: VirtualFlow): void {
        // Ensure layouting is done before external promise returns.
        const promise = new Promise<void>(async (resolve, _reject) => {
            await this._promise;
            this._performLayout();
            resolve();
        });
        this.setPromise(promise);
    }

    private _performLayout(): void {
        let plotBounds = this.bounds.subtractSpacing(10);
        if (this.legend !== undefined) {
            this.legend.performLayout();
            if (!this.legend.overlayOnPlot) {
                let left = 0;
                let right = 0;
                let top = 0;
                let bottom = 0;
                switch (this.legend.position) {
                    case ChartAxisPosition.Left:
                        left += this.legend.bounds.width + ChartLegend.spacing;
                        break;
                    case ChartAxisPosition.Right:
                        right += this.legend.bounds.width + ChartLegend.spacing;
                        break;
                    case ChartAxisPosition.Top:
                        top += this.legend.bounds.height + ChartLegend.spacing;
                        break;
                    case ChartAxisPosition.Bottom:
                        bottom += this.legend.bounds.height + ChartLegend.spacing;
                        break;
                }
                plotBounds = plotBounds.subtractBorder(left, top, right, bottom);
            }
        }
        this.plotArea.bounds = plotBounds;
        this.plotArea.performLayout();
    }
}