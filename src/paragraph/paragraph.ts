import { TextRun } from "../text/text-run.js";
import { DrawingRun } from "../drawing/drawing-run.js";
import { ILayoutable } from "../utils/i-layoutable.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { ParStyle } from "./par-style.js";
import { FontMetrics } from "../utils/font-metrics.js";

export enum ParagraphType {
    Text = 0,
    TableCell = 1,
    Drawing = 2
}

export class Paragraph implements ILayoutable {
    public type: ParagraphType;
    private _runs: (TextRun | DrawingRun)[];
    private _numberingRun: TextRun | undefined;

    constructor(runs: (TextRun | DrawingRun)[], numberingRun: TextRun | undefined) {
        this.type = ParagraphType.Text;
        this._runs = runs;
        this._numberingRun = numberingRun;
    }

    public get style(): ParStyle {
        let idx = 0;
        while(idx < this._runs.length && !(this._runs[idx] instanceof TextRun)) {
            idx++;
            if (idx == this._runs.length) {
                return new ParStyle();
            }
        }
        return (this._runs[idx] as TextRun).style.parStyle;
    }

    public get runs(): (TextRun | DrawingRun)[] {
        return this._runs!;
    }

    public get numberingRun(): TextRun | undefined {
        return this._numberingRun;
    }

    public getUsedWidth(availableWidth: number): number {
        let usedWidth = 0;
        const runs = this.runs;
        for(let i = 0; i < runs.length; i++) {
            const runsWidth = runs[i].getUsedWidth();
            if (runsWidth >= availableWidth) {
                usedWidth = availableWidth;
                break;
            }
            usedWidth += runsWidth;
        }
        return Math.min(usedWidth, availableWidth);
    }

    public getHeight(): number {
        const style = this.style;
        let height = (style !== undefined) ? style.spacingAfter + style.spacingBefore : 0;
        this.runs.forEach(run => {
            height += run.getHeight();
        });
        return height;
    }

    public performLayout(flow: VirtualFlow): void {
        flow.mentionParagraphPosition();
        const startY = flow.getY();
        let previousXPos: number | undefined = 0;
        if (this.style !== undefined) {
            flow.advancePosition(this.style.spacingBefore);
        }
        if (this._numberingRun !== undefined) {
            const clonedFlow = flow.clone();
            // Fix bug in TextFitter.
            clonedFlow.advancePosition(-FontMetrics.getTopToBaseline(this._numberingRun.style));
            this._numberingRun.performLayout(clonedFlow);
            previousXPos = this._numberingRun.lastXPos;
        }
        this.runs.forEach(run => {
            run.previousXPos = previousXPos;
            run.performLayout(flow);
            previousXPos = run.lastXPos;
            flow.mentionCharacterPosition(run.lastXPos!);
        });
        if (this.style !== undefined) {
            flow.advancePosition(this.style.spacingAfter);
        }
        const lineSpacing = this._getLineSpacing();
        if (flow.getY() - startY < lineSpacing) {
            flow.advancePosition(lineSpacing);
        }
    }

    private _getLineSpacing(): number {
        return (this.runs[0] instanceof TextRun) ? this.runs[0].style.lineSpacing : 10;
    }
}