import { BarChart } from "./bar-chart.js";
import { ChartStyle } from "./chart-style.js";
import { ChartPlotArea } from "./chart-plot-area.js";
import { ChartLegend } from "./chart-legend.js";
import { ILayoutable } from "../utils/i-layoutable.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { Rectangle } from "../utils/rectangle.js";
import { Style } from "../text/style.js";
import { ChartAxisPosition, ChartAxis } from "./chart-axis.js";
import { LineRule } from "../paragraph/par-style.js";
import { BaseChart } from "./base-chart.js";

export enum ChartType {
    Bar
}

export class ChartSpace implements ILayoutable {
    private _promise: Promise<void> | undefined = undefined;
    private _chart: BaseChart | undefined = undefined;
    private _type = ChartType.Bar;
    public style: ChartStyle = new ChartStyle();
    public textStyle: Style = new Style();
    public plotArea: ChartPlotArea;
    public legend: ChartLegend | undefined = undefined;
    public bounds: Rectangle = new Rectangle(0, 0, 0, 0);

    constructor() {
        // Hard coded text style.
        this.textStyle.runStyle.updateFont("Arial", false, 11);
        this.textStyle.parStyle._lineSpacing = 240;
        this.textStyle.parStyle._lineRule = LineRule.atLeast;
        this.plotArea = new ChartPlotArea(this);
    }

    public async ensureLoaded(): Promise<void> {
        if (this._promise !== undefined) {
            await this._promise;
            this._promise = undefined;
        }
    }

    public get chartType(): ChartType {
        return this._type;
    }

    public get chart(): BaseChart {
        return this._chart!;
    }

    public setBarChart(barChart: BarChart): void {
        this._chart = barChart;
        this._type = ChartType.Bar;
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
            plotBounds = this._layoutLegend(plotBounds, this.legend);
        }
        if (this.plotArea.valueAxis !== undefined) {
            plotBounds = this._subtractAxis(plotBounds, this.plotArea.valueAxis);
        }
        if (this.plotArea.categoryAxis !== undefined) {
            plotBounds = this._subtractAxis(plotBounds, this.plotArea.categoryAxis);
        }
        this.plotArea.bounds = plotBounds;
        this.plotArea.performLayout();
        if (this.plotArea.valueAxis !== undefined) {
            this.plotArea.valueAxis.performLayout();
        }
        if (this.plotArea.categoryAxis !== undefined) {
            this.plotArea.categoryAxis.performLayout();
        }
    }

    private _layoutLegend(plotBounds: Rectangle, legend: ChartLegend): Rectangle {
        legend.performLayout();
        if (!legend.overlayOnPlot) {
            let left = 0;
            let right = 0;
            let top = 0;
            let bottom = 0;
            switch (legend.position) {
                case ChartAxisPosition.Left:
                    left += legend.bounds.width + ChartLegend.spacing;
                    break;
                case ChartAxisPosition.Right:
                    right += legend.bounds.width + ChartLegend.spacing;
                    break;
                case ChartAxisPosition.Top:
                    top += legend.bounds.height + ChartLegend.spacing;
                    break;
                case ChartAxisPosition.Bottom:
                    bottom += legend.bounds.height + ChartLegend.spacing;
                    break;
            }
            return plotBounds.subtractBorder(left, top, right, bottom);
        }
        // Legend over plot area, no update to plot bounds required.
        return plotBounds;
    }

    private _subtractAxis(plotBounds: Rectangle, axis: ChartAxis): Rectangle {
        const distance = axis.getMaxDistanceFromPlot();
        let left = 0;
        let right = 0;
        let top = 0;
        let bottom = 0;
        switch (axis.position) {
            case ChartAxisPosition.Left:
                left += distance;
                break;
            case ChartAxisPosition.Right:
                right += distance;
                break;
            case ChartAxisPosition.Top:
                top += distance;
                break;
            case ChartAxisPosition.Bottom:
                bottom += distance;
                break;
        }
        return plotBounds.subtractBorder(left, top, right, bottom);
    }
}