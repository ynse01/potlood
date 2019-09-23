import { Paragraph } from "./paragraph.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { TextRenderer } from "../text/text-renderer.js";
import { DrawingRenderer } from "../drawing/drawing-renderer.js";
import { IPainter } from "../painting/i-painter.js";
import { TextRun } from "../text/text-run.js";
import { InSequence } from "./in-sequence.js";

export class ParagraphRenderer {
    private _textRenderer: TextRenderer;
    private _drawingRenderer: DrawingRenderer;

    constructor(painter: IPainter) {
        this._textRenderer = new TextRenderer(painter);
        this._drawingRenderer = new DrawingRenderer(painter);
    }

    public renderParagraph(par: Paragraph, flow: VirtualFlow): void {
        if (par.numberingRun !== undefined) {
          this._textRenderer.renderTextRun(par.numberingRun, flow.clone(), InSequence.First);
        }
        let previousXPos: number | undefined = 0;
        par.runs.forEach((run) => {
            run.previousXPos = previousXPos;    
            if (run instanceof TextRun) {
                this._textRenderer.renderTextRun(run, flow, run.inParagraph);
            } else {
                this._drawingRenderer.renderDrawing(run, flow);
            }
            previousXPos = run.lastXPos;
        });
    }
}