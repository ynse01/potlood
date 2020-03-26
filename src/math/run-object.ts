import { MathObject } from "./math-object.js";
import { TextRun } from "../text/text-run.js";
import { RunStyle } from "../text/run-style.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { Style } from "../text/style.js";
import { IPainter } from "../painting/i-painter.js";
import { TextRenderer } from "../text/text-renderer.js";
import { Size } from "../utils/geometry/size.js";
import { InSequence } from "../utils/in-sequence.js";

export class RunObject extends MathObject {
    private _run: TextRun;

    constructor(text: string, style: RunStyle) {
        super();
        this._run = new TextRun([text], new Style(undefined, style));
        this._run.inParagraph = InSequence.Middle;
    }

    public getSize(): Size {
        return this._run.getSize();
    }

    public performLayout(flow: VirtualFlow, xPadding: number): number {
        this._run.previousXPos = (xPadding !== 0) ? xPadding : undefined;
        this._run.performLayout(flow);
        return this._run.lastXPos;
    }
    
    public render(painter: IPainter): void {
        const renderer = new TextRenderer(painter);
        renderer.renderTextRun(this._run);
    }
}
