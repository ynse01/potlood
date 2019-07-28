import { Metrics } from '../metrics.js';
import { Style } from '../text/style.js';
import { UnderlineMode } from '../text/run-style.js';
import { WordDocument } from '../word-document.js';
import { VirtualFlow } from '../virtual-flow.js';
import { Paragraph, RunInParagraph } from '../paragraph.js';
import { FlowPosition } from '../flow-position.js';
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
  private static readonly svgNS = 'http://www.w3.org/2000/svg';
  private svg: SVGElement;
  private _painter: IPainter;

  constructor(content: HTMLElement) {
    this._painter = new SvgPainter(content);
    this.svg = (this._painter as SvgPainter).svg;
  }

  public renderDocument(doc: WordDocument): number {
    const flow = VirtualFlow.fromSection(doc.section);
    const pos = new FlowPosition(0);
    doc.paragraphs.forEach(parOrTable => {
      if (parOrTable instanceof Paragraph) {
        this.renderParagraph(parOrTable, flow, pos);
      } else {
        this.renderTable(parOrTable, flow, pos);
      }
    });
    return flow.getY(pos);
  }

  public clear() {
    while (this.svg.lastChild) {
        this.svg.removeChild(this.svg.lastChild);
    }
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

  private renderParagraph(par: Paragraph, flow: VirtualFlow, pos: FlowPosition): void {
    if (par.numberingRun !== undefined) {
      this.renderTextRun(par.numberingRun, flow, pos.clone(), RunInParagraph.FirstRun);
    }
    par.runs.forEach((run) => {
      if (run instanceof TextRun) {
        this.renderTextRun(run, flow, pos, run.inParagraph);
      } else {
        this.renderDrawing(run, flow, pos);
      }
    });
  }

  private renderDrawing(drawing: DrawingRun, flow: VirtualFlow, pos: FlowPosition) {
    const x = flow.getX(pos);
    const y = flow.getY(pos);
    const picture = drawing.picture;
    if (picture !== undefined) {
      const rect = document.createElementNS(SvgRenderer.svgNS, "image");
      rect.setAttribute("x", `${x}`);
      rect.setAttribute("y", `${y}`);
      rect.setAttribute("width", `${drawing.bounds.boundSizeX}`);
      rect.setAttribute("height", `${drawing.bounds.boundSizeY}`);
      this.svg.appendChild(rect);
      picture.getImageUrl().then(url => {
        rect.setAttribute("xlink:href", `${url}`);
        rect.setAttribute("href", `${url}`);
      }).catch(error => {
        console.log(`ERROR during rendring: ${error}`);
      })
    }
    pos.add(drawing.getHeight(flow.getWidth(pos)));
  }

  private renderTable(table: Table, flow: VirtualFlow, pos: FlowPosition): void {
    table.rows.forEach(row => {
      const height = row.getMaxHeight();
      row.cells.forEach(cell => {
        const cellFlow = flow.createCellFlow(pos, cell);
        this.renderCellBorder(cell, table.style, cellFlow, pos, height);
        cell.pars.forEach(par => {
          this.renderParagraph(par, cellFlow, pos.clone().add(table.style.cellMarginTop));
        });
      });
      pos.add(height);
    });
  }

  private renderCellBorder(cell: TableCell, style: TableStyle, flow: VirtualFlow, pos: FlowPosition, height: number): void {
    // TODO: Figure out why this offset is required.
    pos = pos.clone().add(Metrics.getLineSpacing((cell.pars[0].runs[0] as TextRun).style) * 0.75);
    if (style.borderTop !== undefined) {
      this.renderHorizontalLine(flow.getX(pos), cell.getWidth(), flow, pos, style.borderTop.color, style.borderTop.size);
    }
    if (style.borderBottom !== undefined) {
      this.renderHorizontalLine(flow.getX(pos), cell.getWidth(), flow, pos.clone().add(height), style.borderBottom.color, style.borderBottom.size);
    }
    if (style.borderStart !== undefined) {
      this.renderVerticalLine(height, flow, pos, style.borderStart.color, style.borderStart.size);
    }
    if (style.borderEnd !== undefined) {
      this.renderVerticalLine(height, flow, pos.clone().add(cell.getWidth()), style.borderEnd.color, style.borderEnd.size);
    }
  }

  private renderTextRun(run: TextRun, flow: VirtualFlow, pos: FlowPosition, inParagraph: RunInParagraph): void {
    if (inParagraph === RunInParagraph.FirstRun || inParagraph === RunInParagraph.OnlyRun) {
      const deltaY = Metrics.getLineSpacing(run.style);
      pos.add(deltaY);
    }
    run.getFlowLines(flow, pos).forEach((line: IPositionedTextLine) => {
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

  private renderHorizontalLine(x: number, lineLength: number, flow: VirtualFlow, pos: FlowPosition, color: string, thickness: number) {
    const y = flow.getY(pos);
    this._painter.paintLine(x, y, x + lineLength, y, color, thickness);
  }

  private renderVerticalLine(lineLength: number, flow: VirtualFlow, pos: FlowPosition, color: string, thickness: number) {
    const x = flow.getX(pos);
    const y = flow.getY(pos);
    this._painter.paintLine(x, y, x, y + lineLength, color, thickness);
  }
}
