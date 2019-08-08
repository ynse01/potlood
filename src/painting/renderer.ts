import { WordDocument } from '../word-document.js';
import { VirtualFlow } from '../virtual-flow.js';
import { Paragraph, RunInParagraph } from '../paragraph.js';
import { SvgPainter } from './svg-painter.js';
import { IPainter } from './i-painter.js';
import { TextRun } from '../text/text-run.js';
import { TextRenderer } from '../text/text-renderer.js';
import { TableRenderer } from '../table/table-renderer.js';
import { DrawingRenderer } from '../drawing/drawing-renderer.js';

export class Renderer {
  private _painter: IPainter;
  private _textRenderer: TextRenderer;
  private _tableRenderer: TableRenderer;
  private _drawingRenderer: DrawingRenderer;

  constructor(content: HTMLElement) {
    this._painter = new SvgPainter(content);
    this._textRenderer = new TextRenderer(this._painter);
    this._tableRenderer = new TableRenderer(this._painter, this);
    this._drawingRenderer = new DrawingRenderer(this._painter);
  }

  public renderDocument(doc: WordDocument): number {
    const flow = VirtualFlow.fromSection(doc.section);
    doc.paragraphs.forEach(parOrTable => {
      if (parOrTable instanceof Paragraph) {
        this.renderParagraph(parOrTable, flow);
      } else {
        this._tableRenderer.renderTable(parOrTable, flow);
      }
    });
    return flow.getY();
  }

  public clear() {
    this._painter.clear();
  }

  public ensureHeight(newHeight: number): void {
    this._painter.ensureHeight(newHeight);
  }

  public renderParagraph(par: Paragraph, flow: VirtualFlow): void {
    if (par.numberingRun !== undefined) {
        this._textRenderer.renderTextRun(par.numberingRun, flow.clone(), RunInParagraph.FirstRun);
    }
    par.runs.forEach((run) => {
      if (run instanceof TextRun) {
          this._textRenderer.renderTextRun(run, flow, run.inParagraph);
      } else {
          this._drawingRenderer.renderDrawing(run, flow);
      }
    });
  }


}
