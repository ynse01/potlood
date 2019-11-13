import { ChartSpace } from "./chart-space.js";
import { FontMetrics } from "../utils/font-metrics.js";
import { ChartStyle } from "./chart-style.js";

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
            const texts = (this.isValueAxis) ? this._getValueNames() : this._getCategoryNames();
            texts.forEach(text => {
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
        switch(this.position) {
            case ChartAxisPosition.Left:
                
                break;
            case ChartAxisPosition.Right:
                
                break;
            case ChartAxisPosition.Top:
                
                break;
            case ChartAxisPosition.Bottom:
                
                break;
        }
    }

    private _getValueNames(): string[] {
        return this._space.barChart!.series.map(serie => {
            return serie.name;
        });
    }

    private _getCategoryNames(): string[]  {
        return this._space.barChart!.series[0].categories.map(cat => {
            return cat.toString();
        });
    }
}