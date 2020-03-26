import { ChartStyle } from "./chart-style.js";
import { ChartAxisPosition } from "./chart-axis.js";
import { Box } from "../utils/geometry/box.js";
import { ChartSpace } from "./chart-space.js";
import { FontMetrics } from "../utils/font-metrics.js";
import { InSequence } from "../utils/in-sequence.js";
import { IPositionedTextLine } from "../text/positioned-text-line.js";

export class ChartLegend {
    public space: ChartSpace;
    public style: ChartStyle = new ChartStyle();
    public position: ChartAxisPosition = ChartAxisPosition.Right;
    public overlayOnPlot: boolean = false;
    public onlySeries: number | undefined = undefined;
    public bounds: Box = new Box(0, 0, 0, 0);
    private static _widgetSize = 10;
    private static _widgetSpacing = 5;
    public static spacing = 5;

    constructor(space: ChartSpace) {
        this.space = space;
    }

    public get widgetSize(): number {
        return ChartLegend._widgetSize;
    }

    public get widgetSpacing(): number {
        return ChartLegend._widgetSpacing;
    }

    public getLines(): IPositionedTextLine[] {
        const lines: IPositionedTextLine[] = [];
        const textStyle = this.space.textStyle;
        const x = this.bounds.x + ChartLegend._widgetSize + ChartLegend._widgetSpacing;
        let y = this.bounds.y + FontMetrics.getTopToBaseline(textStyle);
        this._getNames().forEach(name => {
            lines.push({
                text: name,
                x: x,
                y: y,
                width: this.bounds.width,
                stretched: false,
                following: false,
                color: textStyle.color,
                fontFamily: textStyle.fontFamily,
                fontSize: textStyle.fontSize,
                emphasis: textStyle.emphasis
            });
            y += textStyle.lineSpacing;
        });
        return lines;
    }

    public performLayout(): void {
        const size = this._getSize();
        const spaceBounds = this.space.bounds;
        let xPos = InSequence.Last;
        let yPos = InSequence.Middle;
        switch(this.position) {
            case ChartAxisPosition.Left:
                xPos = InSequence.First;
                yPos = InSequence.Middle;
                break;
            case ChartAxisPosition.Right:
                xPos = InSequence.Last;
                yPos = InSequence.Middle;
                break;
            case ChartAxisPosition.Top:
                xPos = InSequence.Middle;
                yPos = InSequence.First;
                break;
            case ChartAxisPosition.Right:
                xPos = InSequence.Middle;
                yPos = InSequence.Last;
                break;
        }
        this.bounds = spaceBounds.subtractSpacing(ChartLegend.spacing).placeInRectangle(size.width, size.height, xPos, yPos);
    }

    public getColors(): string[] {
        let colors: string[];
        if (this.onlySeries === undefined) {
            colors = this.space.chart.series.map((series) => series.style.lineColor || series.style.fillColor || "000000");
        } else {
            colors = this.space.chart.series[this.onlySeries].categories.map((cat) => {
                let color = "000000";
                if (cat.style !== undefined) {
                    color = cat.style.lineColor || cat.style.fillColor || "000000";
                }
                return color;
            });
        }
        return colors;
    }

    private _getNames(): string[] {
        let names: string[];
        if (this.onlySeries === undefined) {
            names = this.space.chart.series.map((series) => series.name);
        } else {
            names = this.space.chart.series[this.onlySeries].categories.map((cat) => cat.text || "");
        }
        return names;
    }

    private _getSize(): { width: number, height: number } {
        const charWidth = FontMetrics.averageCharWidth(this.space.textStyle);
        let maxChars = 0;
        const names = this._getNames();
        names.forEach(name => {
            maxChars = Math.max(maxChars, name.length);
        });
        const lineSpacing = this.space.textStyle.lineSpacing;
        const height = names.length * lineSpacing;
        const textWidth = (maxChars + 1) * charWidth;
        const widgetWidth = ChartLegend._widgetSize + ChartLegend._widgetSpacing;
        return { width: textWidth + widgetWidth, height: height };
    }
}