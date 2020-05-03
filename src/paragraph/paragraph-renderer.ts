import { Paragraph } from "./paragraph";
import { TextRenderer } from "../text/text-renderer";
import { DrawingRenderer } from "../drawing/drawing-renderer";
import { IPainter } from "../painting/i-painter";
import { TextRun } from "../text/text-run";
import { DrawingRun } from "../drawing/drawing-run";
import { MathRenderer } from "../math/math-renderer";
import { MathRun } from "../math/math-run";

export class ParagraphRenderer {
    private _textRenderer: TextRenderer;
    private _drawingRenderer: DrawingRenderer;
    private _mathRenderer: MathRenderer;

    constructor(painter: IPainter) {
        this._textRenderer = new TextRenderer(painter);
        this._drawingRenderer = new DrawingRenderer(painter);
        this._mathRenderer = new MathRenderer(painter);
    }

    public renderParagraph(par: Paragraph): void {
        let previousXPos: number | undefined = 0;
        if (par.numberingRun !== undefined) {
          this._textRenderer.renderTextRun(par.numberingRun);
          previousXPos = par.numberingRun.lastXPos;
        }
        par.runs.forEach((run) => {
            run.previousXPos = previousXPos;
            if (run instanceof TextRun) {
                this._textRenderer.renderTextRun(run);
            } else if (run instanceof DrawingRun) {
                this._drawingRenderer.renderDrawing(run);
            } else if (run instanceof MathRun) {
                this._mathRenderer.renderMathRun(run as MathRun);
            } else {
                console.log('Unknown Run type encountered during rendering, skipping it');
            }
            previousXPos = run.lastXPos;
        });
    }
}