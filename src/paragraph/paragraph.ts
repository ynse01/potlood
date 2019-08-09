import { TextRun } from "../text/text-run.js";
import { DrawingRun } from "../drawing/drawing-run.js";
import { ILayoutable } from "../utils/i-layoutable.js";
import { VirtualFlow } from "../utils/virtual-flow.js";

export enum RunInParagraph {
    Normal = 0,
    FirstRun = 1,
    LastRun = 2,
    OnlyRun = 3,
    Numbering = 4
}

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

    public get runs(): (TextRun | DrawingRun)[] {
        return this._runs!;
    }

    public get numberingRun(): TextRun | undefined {
        return this._numberingRun;
    }

    public getTextHeight(width: number): number {
        let height = 0;
        this.runs.forEach(run => {
            height += run.getHeight(width);
        });
        return height;
    }

    public performLayout(flow: VirtualFlow): void {
        let previousXPos = -1;
        this.runs.forEach(run => {
            run.previousXPos = previousXPos;
            run.performLayout(flow);
            previousXPos = run.lastXPos!;
        })
    }

}