import { Paragraph } from "./paragraph.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { TextRenderer } from "../text/text-renderer.js";
import { DrawingRenderer } from "../drawing/drawing-renderer.js";
import { IPainter } from "../painting/i-painter.js";
import { TextRun } from "../text/text-run.js";

export class ParagraphRenderer {
    private _textRenderer: TextRenderer;
    private _drawingRenderer: DrawingRenderer;

    constructor(painter: IPainter) {
        this._textRenderer = new TextRenderer(painter);
        this._drawingRenderer = new DrawingRenderer(painter);
    }

    public renderParagraph(par: Paragraph, flow: VirtualFlow): void {
        const parStyle = par.style;
        if (parStyle !== undefined && parStyle._parLinesBefore !== undefined && parStyle._lineSpacing !== undefined) {
            flow.advancePosition(parStyle._parLinesBefore * parStyle._lineSpacing);
        } else if (parStyle !== undefined && parStyle._parSpacingBefore !== undefined) {
            flow.advancePosition(parStyle._parSpacingBefore);
        }
        let previousXPos: number | undefined = 0;
        if (par.numberingRun !== undefined) {
          this._textRenderer.renderTextRun(par.numberingRun, flow.clone());
          previousXPos = par.numberingRun.lastXPos;
        }
        par.runs.forEach((run) => {
            run.previousXPos = previousXPos;    
            if (run instanceof TextRun) {
                this._textRenderer.renderTextRun(run, flow);
            } else {
                this._drawingRenderer.renderDrawing(run, flow);
            }
            previousXPos = run.lastXPos;
        });
        if (parStyle !== undefined && parStyle._parLinesAfter !== undefined && parStyle._lineSpacing !== undefined) {
            flow.advancePosition(parStyle._parLinesAfter * parStyle._lineSpacing);
        } else if (parStyle !== undefined && parStyle._parSpacingAfter !== undefined) {
            flow.advancePosition(parStyle._parSpacingAfter);
        }
    }
}