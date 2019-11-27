import { ChartStyle } from "./chart-style.js";
import { ChartAxisPosition } from "./chart-axis.js";
import { Rectangle } from "../utils/rectangle.js";
import { ChartSpace } from "./chart-space.js";
import { FontMetrics } from "../utils/font-metrics.js";
import { InSequence } from "../utils/in-sequence.js";
import { IPositionedTextLine } from "../text/positioned-text-line.js";

export class ChartLegend {
    public space: ChartSpace;
    public style: ChartStyle = new ChartStyle();
    public position: ChartAxisPosition = ChartAxisPosition.Right;
    public overlayOnPlot: boolean = false;
    public bounds: Rectangle = new Rectangle(0, 0, 0, 0);
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
                emphasis: FontMetrics.getEmphasis(textStyle)
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
        return this.space.chart.series.map((series) => series.color);
    }

    private _getNames(): string[] {
        return this.space.chart.series.map((series) => series.name);
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