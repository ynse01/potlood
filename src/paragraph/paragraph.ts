import { TextRun } from "../text/text-run.js";
import { DrawingRun } from "../drawing/drawing-run.js";
import { ILayoutable } from "../utils/i-layoutable.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { ParStyle } from "./par-style.js";

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

    public get style(): ParStyle | undefined {
        let parStyle: ParStyle | undefined = undefined;
        const firstRun = this._runs[0];
        if (firstRun !== undefined && firstRun instanceof TextRun) {
            const firstTextRun = firstRun as TextRun;
            parStyle = firstTextRun.style.parStyle;
        }
        return parStyle;
    }

    public get runs(): (TextRun | DrawingRun)[] {
        return this._runs!;
    }

    public get numberingRun(): TextRun | undefined {
        return this._numberingRun;
    }

    public getHeight(width: number): number {
        const style = this.style;
        let height = (style !== undefined) ? style.spacingAfter + style.spacingBefore : 0;
        this.runs.forEach(run => {
            height += run.getHeight(width);
        });
        return height;
    }

    public performLayout(flow: VirtualFlow): void {
        let previousXPos: number | undefined = -1;
        flow.advancePosition(this.style!.spacingBefore);
        this.runs.forEach(run => {
            run.previousXPos = previousXPos;
            run.performLayout(flow);
            previousXPos = run.lastXPos;
        });
        flow.advancePosition(this.style!.spacingAfter);
    }

}