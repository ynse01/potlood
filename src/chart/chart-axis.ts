import { ChartSpace } from "./chart-space.js";
import { FontMetrics } from "../utils/font-metrics.js";
import { ChartStyle } from "./chart-style.js";
import { IPositionedTextLine, IPositionedLine } from "../text/positioned-text-line.js";
import { InSequence } from "../utils/in-sequence.js";

export enum ChartAxisPosition {
    Top,
    Bottom,
    Left,
    Right
}

export enum ChartAxisTickMode {
    None,
    Outwards
}

export enum ChartAxisLabelAlignment {
    Center
}

export enum ChartAxisCrossMode {
    AutoZero
}

export class ChartAxis {
    public position: ChartAxisPosition;
    public majorTickMode: ChartAxisTickMode;
    public minorTickMode: ChartAxisTickMode;
    public majorGridStyle: ChartStyle;
    public minorGridStyle: ChartStyle;
    public labelAlignment: ChartAxisLabelAlignment = ChartAxisLabelAlignment.Center;
    public labelOffset: number;
    public crossMode: ChartAxisCrossMode = ChartAxisCrossMode.AutoZero;
    public style: ChartStyle;
    public positionedTexts: IPositionedTextLine[] | undefined = undefined;
    public positionedLines: IPositionedLine[] | undefined = undefined;
    private _space: ChartSpace;
    private _isValueAxis: boolean;
    private static _labelSpacing = 5;
    private static _majorOutwardLength = 5;
    private static _minorOutwardLength = 5;

    constructor(space: ChartSpace, style: ChartStyle, pos: ChartAxisPosition, major: ChartAxisTickMode, minor: ChartAxisTickMode, offset: number, isValueAxis: boolean) {
        this._space = space;
        this.style = style;
        this.position = pos;
        this.majorTickMode = major;
        this.minorTickMode = minor;
        this.labelOffset = offset;
        this.majorGridStyle = new ChartStyle();
        this.minorGridStyle = new ChartStyle();
        this._isValueAxis = isValueAxis;
    }

    public get isValueAxis(): boolean {
        return this._isValueAxis;
    }

    public get isCategoryAxis(): boolean {
        return !this._isValueAxis;
    }

    public getMaxDistanceFromPlot() {
        let maxDistance : number;
        if (this.position === ChartAxisPosition.Bottom || this.position === ChartAxisPosition.Top) {
            maxDistance = ChartAxis._labelSpacing + this._space.textStyle.lineSpacing;
        } else {
            let maxChars = 0;
            this._getTexts().forEach(text => {
                maxChars = Math.max(maxChars, text.length);
            });
            maxDistance = maxChars * FontMetrics.averageCharWidth(this._space.textStyle);
            maxDistance += ChartAxis._labelSpacing;
        }
        if (this.majorTickMode === ChartAxisTickMode.Outwards) {
            maxDistance += ChartAxis._majorOutwardLength;
        } else if (this.minorTickMode === ChartAxisTickMode.Outwards) {
            maxDistance += ChartAxis._minorOutwardLength;
        }
        return maxDistance;
    }

    public performLayout(): void {
        this.positionedTexts = [];
        this.positionedLines = [];
        const textLines = this.positionedTexts;
        const lines = this.positionedLines;
        const plotBounds = this._space.plotArea.bounds;
        const hasNumericValues = this._hasNumericValues();
        switch(this.position) {
            case ChartAxisPosition.Left:
                if (hasNumericValues) {

                }
                break;
            case ChartAxisPosition.Right:
                
                break;
            case ChartAxisPosition.Top:
                
                break;
            case ChartAxisPosition.Bottom:
                if (!hasNumericValues) {
                    const texts = this._getTexts();
                    const halfSegmentWidth = (plotBounds.width / texts.length) / 2;
                    let currentX = plotBounds.x;
                    let textY = plotBounds.bottom + ChartAxis._labelSpacing + FontMetrics.getTopToBaseline(this._space.textStyle);
                    let lineY1 = plotBounds.bottom;
                    let lineY2 = plotBounds.bottom;
                    if (this.majorTickMode === ChartAxisTickMode.Outwards) {
                        textY += ChartAxis._majorOutwardLength;
                        lineY2 += ChartAxis._majorOutwardLength;
                    } else if (this.minorTickMode === ChartAxisTickMode.Outwards) {
                        textY += ChartAxis._minorOutwardLength;
                        lineY2 += ChartAxis._minorOutwardLength;
                    }
                    if (this.majorGridStyle.lineColor !== undefined) {
                        lineY1 += plotBounds.top;
                    }
                    texts.forEach(text => {
                        textLines.push(this._createPositionedText(currentX + halfSegmentWidth, textY, text));
                        lines.push({
                            x1: currentX,
                            x2: currentX,
                            y1: lineY1,
                            y2: lineY2
                        });
                        currentX += 2 * halfSegmentWidth;
                    });
                    lines.push({
                        x1: currentX,
                        x2: currentX,
                        y1: lineY1,
                        y2: lineY2
                    });
                }
                break;
        }
    }

    private _hasNumericValues(): boolean {
        const chart = this._space.chart;
        return (this.isValueAxis) ? chart.series[0].hasNumericValues : chart.series[0].hasNumericCategories;
    }

    private _getTexts(): string[] {
        return (this.isValueAxis) ? this._getValueNames() : this._getCategoryNames();
    }

    private _getValueNames(): string[] {
        return this._space.chart.series.map(serie => {
            return serie.name;
        });
    }

    private _getCategoryNames(): string[]  {
        return this._space.chart.series[0].categories.map(cat => {
            return cat.toString();
        });
    }

    private _createPositionedText(x: number, y: number, text: string): IPositionedTextLine {
        return {
            text: text,
            x: x,
            y: y,
            width: 0,
            fitWidth: false,
            following: false,
            inRun: InSequence.Only
        };
    }
}