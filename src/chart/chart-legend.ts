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

    constructor(space: ChartSpace) {
        this.space = space;
    }

    public getLines(): IPositionedTextLine[] {
        const lines: IPositionedTextLine[] = [];
        const textStyle = this.space.textStyle;
        let y = this.bounds.y + FontMetrics.getTopToBaseline(textStyle);
        this._getNames().forEach(name => {
            lines.push({
                text: name,
                x: this.bounds.x,
                y: y,
                width: this.bounds.width,
                fitWidth: false,
                following: false,
                inRun: InSequence.Only
            });
            y += textStyle.lineSpacing;
        });
        return lines;
    }

    public performLayout(): void {
        const size = this._getSize();
        const spaceBounds = this.space.bounds!;
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
        this.bounds = spaceBounds.placeInRectangle(size.width, size.height, xPos, yPos);
    }

    private _getNames(): string[] {
        return this.space.barChart!.series.map((series) => series.name);
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
        return { width: (maxChars + 1) * charWidth, height: height };
    }
}