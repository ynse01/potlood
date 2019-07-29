import { Metrics } from '../utils/metrics.js';
import { Style } from '../text/style.js';
import { UnderlineMode } from '../text/run-style.js';
import { WordDocument } from '../word-document.js';
import { VirtualFlow } from '../virtual-flow.js';
import { Paragraph, RunInParagraph } from '../paragraph.js';
import { Table } from '../table/table.js';
import { TableStyle } from '../table/table-style.js';
import { IPositionedTextLine } from '../text/positioned-text-line.js';
import { Xml } from '../utils/xml.js';
import { DrawingRun } from '../drawing/drawing-run.js';
import { SvgPainter } from './svg-painter.js';
import { IPainter, IRectangle } from './i-painter.js';
import { TextRun } from '../text/text-run.js';
import { TableCell } from '../table/table-cell.js';

export class SvgRenderer {
  private svg: SVGElement;
  private _painter: IPainter;

  constructor(content: HTMLElement) {
    this._painter = new SvgPainter(content);
    this.svg = (this._painter as SvgPainter).svg;
  }

  public renderDocument(doc: WordDocument): number {
    const flow = VirtualFlow.fromSection(doc.section);
    doc.paragraphs.forEach(parOrTable => {
      if (parOrTable instanceof Paragraph) {
        this.renderParagraph(parOrTable, flow);
      } else {
        this.renderTable(parOrTable, flow);
      }
    });
    return flow.getY();
  }

  public clear() {
    this._painter.clear();
  }

  public ensureHeight(newHeight: number): void {
    const height = Xml.getAttribute(this.svg, "height");
    if (height !== undefined) {
      const heightNum = parseFloat(height);
      const maxY = Math.max(heightNum, newHeight);
      if (maxY > heightNum) {
        this.svg.setAttribute("height", maxY.toString());
      }
    }
  }

  private renderParagraph(par: Paragraph, flow: VirtualFlow): void {
    if (par.numberingRun !== undefined) {
      this.renderTextRun(par.numberingRun, flow.clone(), RunInParagraph.FirstRun);
    }
    par.runs.forEach((run) => {
      if (run instanceof TextRun) {
        this.renderTextRun(run, flow, run.inParagraph);
      } else {
        this.renderDrawing(run, flow);
      }
    });
  }

  private renderDrawing(drawing: DrawingRun, flow: VirtualFlow) {
    const x = flow.getX();
    const y = flow.getY();
    const width = drawing.bounds.boundSizeX;
    const height = drawing.bounds.boundSizeY;
    const picture = drawing.picture;
    if (picture !== undefined) {
      this._painter.paintPicture(x, y, width, height, picture);
    }
    flow.advancePosition(drawing.getHeight(flow.getWidth()));
  }

  private renderTable(table: Table, flow: VirtualFlow): void {
    table.rows.forEach(row => {
      const height = row.getMaxHeight();
      row.cells.forEach(cell => {
        const cellFlow = flow.createCellFlow(cell);
        this.renderCellBorder(cell, table.style, cellFlow, height);
        cell.pars.forEach(par => {
          this.renderParagraph(par, cellFlow.clone().advancePosition(table.style.cellMarginTop));
        });
      });
      flow.advancePosition(height);
    });
  }

  private renderCellBorder(cell: TableCell, style: TableStyle, flow: VirtualFlow, height: number): void {
    // TODO: Figure out why this offset is required.
    flow = flow.clone().advancePosition(Metrics.getLineSpacing((cell.pars[0].runs[0] as TextRun).style) * 0.75);
    if (style.borderTop !== undefined) {
      this.renderHorizontalLine(flow.getX(), cell.getWidth(), flow, style.borderTop.color, style.borderTop.size);
    }
    if (style.borderBottom !== undefined) {
      this.renderHorizontalLine(flow.getX(), cell.getWidth(), flow.clone().advancePosition(height), style.borderBottom.color, style.borderBottom.size);
    }
    if (style.borderStart !== undefined) {
      this.renderVerticalLine(height, flow, style.borderStart.color, style.borderStart.size);
    }
    if (style.borderEnd !== undefined) {
      this.renderVerticalLine(height, flow.clone().advancePosition(cell.getWidth()), style.borderEnd.color, style.borderEnd.size);
    }
  }

  private renderTextRun(run: TextRun, flow: VirtualFlow, inParagraph: RunInParagraph): void {
    if (inParagraph === RunInParagraph.FirstRun || inParagraph === RunInParagraph.OnlyRun) {
      const deltaY = Metrics.getLineSpacing(run.style);
      flow.advancePosition(deltaY);
    }
    run.getFlowLines(flow).forEach((line: IPositionedTextLine) => {
      this.renderText(line, run.style);
    });
  }

  private renderText(line: IPositionedTextLine, style: Style): void {
    if (style.caps) {
      line.text = line.text.toLocaleUpperCase();
    }
    this._painter.paintText(line.x, line.y, line.width, line.fitWidth, line.text, style.color, style.justification, style.fontFamily, style.fontSize, style.bold, style.italic);
    if (style.underlineMode !== UnderlineMode.none || style.strike || style.doubleStrike) {
      // Render underline after adding text to DOM.
      const lastTextRect = this._painter.measureLastText();
      this.renderUnderline(style, lastTextRect);
    }
  }

  private renderUnderline(style: Style, textRect: IRectangle): void {
    // TODO: Support all underline modes
    const fontSize = style.fontSize;
    const y = textRect.y + fontSize;
    switch(style.underlineMode) {
      case UnderlineMode.double:
        this._painter.paintLine(textRect.x, y, textRect.x + textRect.width, y + fontSize / 10, style.color, 1);
        this._painter.paintLine(textRect.x, y, textRect.x + textRect.width, y + fontSize / 10, style.color, 1);
        break;
      case UnderlineMode.none:
        // Nothing to be done
        break;
      default:
      case UnderlineMode.single:
        this._painter.paintLine(textRect.x, y, textRect.x + textRect.width, y + fontSize / 10, style.color, 1);
        break;
    }
    if (style.strike) {
      this._painter.paintLine(textRect.x, y, textRect.x + textRect.width, y - fontSize / 2, style.color, 1);
    }
    if (style.doubleStrike) {
      this._painter.paintLine(textRect.x, y, textRect.x + textRect.width, y - (fontSize / 2) - 1, style.color, 1);
      this._painter.paintLine(textRect.x, y, textRect.x + textRect.width, y - (fontSize / 2) + 2, style.color, 1);
    }
  }

  private renderHorizontalLine(x: number, lineLength: number, flow: VirtualFlow, color: string, thickness: number) {
    const y = flow.getY();
    this._painter.paintLine(x, y, x + lineLength, y, color, thickness);
  }

  private renderVerticalLine(lineLength: number, flow: VirtualFlow, color: string, thickness: number) {
    const x = flow.getX();
    const y = flow.getY();
    this._painter.paintLine(x, y, x, y + lineLength, color, thickness);
  }
}
