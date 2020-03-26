import { BarChart } from "./bar-chart.js";
import { ChartStyle } from "./chart-style.js";
import { ChartPlotArea } from "./chart-plot-area.js";
import { ChartLegend } from "./chart-legend.js";
import { ILayoutable } from "../utils/i-layoutable.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { Box } from "../utils/math/box.js";
import { Style } from "../text/style.js";
import { ChartAxisPosition, ChartAxis } from "./chart-axis.js";
import { BaseChart } from "./base-chart.js";
import { LineChart } from "./line-chart.js";
import { AreaChart } from "./area-chart.js";
import { PieChart } from "./pie-chart.js";

export enum ChartType {
    Bar,
    Line,
    Area,
    Pie
}

export class ChartSpace implements ILayoutable {
    private _promise: Promise<void> | undefined = undefined;
    private _chart: BaseChart | undefined = undefined;
    private _type = ChartType.Bar;
    public style: ChartStyle = new ChartStyle();
    public textStyle: Style = new Style();
    public plotArea: ChartPlotArea;
    public legend: ChartLegend | undefined = undefined;
    public bounds: Box = new Box(0, 0, 0, 0);

    constructor() {
        // Hard coded text style.
        this.textStyle.runStyle.updateFont("Arial", false, 11);
        this.textStyle.parStyle.setLineSpacing(240);
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

    public setAreaChart(areaChart: AreaChart): void {
        this._chart = areaChart;
        this._type = ChartType.Area;
    }

    public setLineChart(lineChart: LineChart): void {
        this._chart = lineChart;
        this._type = ChartType.Line;
    }

    public setBarChart(barChart: BarChart): void {
        this._chart = barChart;
        this._type = ChartType.Bar;
    }

    public setPieChart(pieChart: PieChart): void {
        this._chart = pieChart;
        this._type = ChartType.Pie;
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
        this.plotArea.determineRange();
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
        if (this.plotArea.valueAxis !== undefined) {
            this.plotArea.valueAxis.performLayout();
        }
        if (this.plotArea.categoryAxis !== undefined) {
            this.plotArea.categoryAxis.performLayout();
        }
    }

    private _layoutLegend(plotBounds: Box, legend: ChartLegend): Box {
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

    private _subtractAxis(plotBounds: Box, axis: ChartAxis): Box {
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