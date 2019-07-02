import { Metrics } from './metrics.js';
import { Style } from './style.js';
import { Justification } from './par-style.js';
import { UnderlineMode } from './run-style.js';
import { WordDocument } from './word-document.js';
import { VirtualFlow } from './virtual-flow.js';
import { Paragraph, RunInParagraph } from './paragraph.js';
import { FlowPosition } from './flow-position.js';
import { LineInRun, TextRun } from './text-run.js';
import { Table, TableCell } from './table.js';
import { TableStyle } from './table-style.js';
import { IPositionedTextLine } from './positioned-text-line.js';

export class SvgRenderer {
  private static readonly svgNS = 'http://www.w3.org/2000/svg';
  private svg: SVGElement;

  constructor(content: HTMLElement) {
    const svg = document.createElementNS(SvgRenderer.svgNS, 'svg');
    svg.setAttribute('id', 'svg');
    svg.setAttribute('width', content.clientWidth.toString());
    svg.setAttribute('height', '500');
    content.appendChild(svg);
    this.svg = svg;
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
    const height = this.svg.getAttribute("height");
    if (height !== null) {
      const heightNum = parseFloat(height);
      const maxY = Math.max(heightNum, newHeight);
      if (maxY > heightNum) {
        this.svg.setAttribute("height", maxY.toString());
      }
    }
  }

  private renderParagraph(par: Paragraph, flow: VirtualFlow, pos: FlowPosition): void {
    if (par.numberingRun !== undefined) {
      this.renderRun(par.numberingRun, flow, pos.clone(), RunInParagraph.FirstRun);
    }
    par.runs.forEach((run) => {
      this.renderRun(run, flow, pos, run.inParagraph);
    });
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
    pos = pos.clone().add(Metrics.getLineSpacing(cell.pars[0].runs[0].style) * 0.75);
    if (style.borderTop !== undefined) {
      this.renderHorizontalLine(cell.getWidth(), flow, pos, style.borderTop.color, style.borderTop.size);
    }
    if (style.borderBottom !== undefined) {
      this.renderHorizontalLine(cell.getWidth(), flow, pos.clone().add(height), style.borderBottom.color, style.borderBottom.size);
    }
    if (style.borderStart !== undefined) {
      this.renderVerticalLine(height, flow, pos, style.borderStart.color, style.borderStart.size);
    }
    if (style.borderEnd !== undefined) {
      this.renderVerticalLine(height, flow, pos.clone().add(cell.getWidth()), style.borderEnd.color, style.borderEnd.size);
    }
  }

  private renderRun(run: TextRun, flow: VirtualFlow, pos: FlowPosition, inParagraph: RunInParagraph): void {
    if (inParagraph === RunInParagraph.FirstRun || inParagraph === RunInParagraph.OnlyRun) {
      const deltaY = Metrics.getLineSpacing(run.style);
      pos.add(deltaY);
    }
    run.getFlowLines(flow, pos, inParagraph).forEach((line: IPositionedTextLine) => {
      this.addText(line.text, run.style, flow, line.pos, line.inRun);
      flow.useWidth(line.pos, line.claim);
    });
  }

  private addText(
    text: string,
    style: Style,
    flow: VirtualFlow,
    pos: FlowPosition,
    inRun: LineInRun
  ): void {
    const newText = document.createElementNS(SvgRenderer.svgNS, 'text');
    if (style.caps) {
      text = text.toLocaleUpperCase();
    }
    this.setFont(newText, style);
    this.setColor(newText, style);
    this.setHorizontalAlignment(newText, style, flow, pos, inRun);
    this.setVerticalAlignment(newText, style, flow, pos);
    const textNode = document.createTextNode(text);
    newText.appendChild(textNode);
    this.svg.appendChild(newText);
    // Render underline after adding text to DOM.
    this.renderUnderline(newText, style, flow, pos);
  }

  private setFont(textNode: Element, style: Style): void {
    textNode.setAttribute('font-family', style.fontFamily);
    textNode.setAttribute('font-size', style.fontSize.toString());
    if (style.bold) {
      textNode.setAttribute('font-weight', 'bold');
    }
    if (style.italic) {
      textNode.setAttribute('font-style', 'italic');
    }
  }

  private setColor(textNode: Element, style: Style) {
    textNode.setAttribute('fill', `#${style.color}`);
  }

  private setHorizontalAlignment(textNode: Element, style: Style, flow: VirtualFlow, pos: FlowPosition, inRun: LineInRun): void {
    const xDelta = (inRun === LineInRun.FirstLine || inRun === LineInRun.OnlyLine) ? style.hanging : style.identation;
    const x = flow.getX(pos) + xDelta;
    const width = flow.getWidth(pos);
    switch(style.justification) {
      case Justification.both:
        textNode.setAttribute('x', x.toString());
        if (inRun !== LineInRun.LastLine && inRun !== LineInRun.OnlyLine) {
          textNode.setAttribute('textLength', (width - style.identation).toString());
          textNode.setAttribute('lengthAdjust', 'spacing');
        }
        break;
      case Justification.right:
        const right = x + width;
        textNode.setAttribute('x', right.toString());
        textNode.setAttribute('text-anchor', "end");
        break;
      case Justification.center:
        const center = x + width / 2;
        textNode.setAttribute('x', center.toString());
        textNode.setAttribute('text-anchor', "middle");
        break;
      case Justification.left:
      default:
        textNode.setAttribute('x', x.toString());
        textNode.setAttribute('text-anchor', "start");
        break;
    }
  }

  private setVerticalAlignment(textNode: Element, style: Style, flow: VirtualFlow, pos: FlowPosition): void {
    textNode.setAttribute('y', (flow.getY(pos) + style.fontSize / 2).toString());
    textNode.setAttribute('alignment-baseline', 'top');
  }

  private renderUnderline(textNode: Element, style: Style, flow: VirtualFlow, pos: FlowPosition): void {
    // TODO: Support all underline modes
    if (style.underlineMode !== UnderlineMode.none || style.strike || style.doubleStrike) {
      let lineLength = (textNode as any).getComputedTextLength();
      const y = pos.clone().add(style.fontSize / 2);
      switch(style.underlineMode) {
        case UnderlineMode.double:
          this.renderHorizontalLine(lineLength, flow, y.add(style.fontSize / 10), style.color, 1);
          this.renderHorizontalLine(lineLength, flow, y.add(style.fontSize / 10), style.color, 1);
          break;
        case UnderlineMode.none:
          // Nothing to be done
          break;
        default:
        case UnderlineMode.single:
          this.renderHorizontalLine(lineLength, flow, y.add(style.fontSize / 10), style.color, 1);
          break;
      }
      if (style.strike) {
        this.renderHorizontalLine(lineLength, flow, y.subtract(style.fontSize / 2), style.color, 1);
      }
      if (style.doubleStrike) {
        const middle = y.subtract(style.fontSize / 2);
        this.renderHorizontalLine(lineLength, flow, middle.subtract(1), style.color, 1);
        this.renderHorizontalLine(lineLength, flow, middle.add(2), style.color, 1);
      }
    }
  }

  private renderHorizontalLine(lineLength: number, flow: VirtualFlow, pos: FlowPosition, color: string, thickness: number) {
    const x = flow.getX(pos);
    const y = flow.getY(pos);
    this.renderLine(x, y, x + lineLength, y, color, thickness);
  }

  private renderVerticalLine(lineLength: number, flow: VirtualFlow, pos: FlowPosition, color: string, thickness: number) {
    const x = flow.getX(pos);
    const y = flow.getY(pos);
    this.renderLine(x, y, x, y + lineLength, color, thickness);
  }

  private renderLine(x1: number, y1: number, x2: number, y2: number, color: string, thickness: number): void {
    const line = document.createElementNS(SvgRenderer.svgNS, "line");
    line.setAttribute("x1", x1.toString());
    line.setAttribute("y1", y1.toString());
    line.setAttribute("x2", x2.toString());
    line.setAttribute("y2", y2.toString());
    line.setAttribute("stroke", `#${color}`);
    line.setAttribute("stroke-width", thickness.toString());
    this.svg.appendChild(line);
  }
}
