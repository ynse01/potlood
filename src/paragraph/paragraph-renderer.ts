import { Paragraph } from "./paragraph.js";
import { TextRenderer } from "../text/text-renderer.js";
import { DrawingRenderer } from "../drawing/drawing-renderer.js";
import { IPainter } from "../painting/i-painter.js";
import { TextRun } from "../text/text-run.js";
import { DrawingRun } from "../drawing/drawing-run.js";

export class ParagraphRenderer {
    private _textRenderer: TextRenderer;
    private _drawingRenderer: DrawingRenderer;

    constructor(painter: IPainter) {
        this._textRenderer = new TextRenderer(painter);
        this._drawingRenderer = new DrawingRenderer(painter);
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
            } else {
                console.log("Not sure how to render Math Runs yet.");
            }
            previousXPos = run.lastXPos;
        });
    }
}