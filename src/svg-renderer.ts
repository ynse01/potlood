import { Metrics } from './metrics.js';
import { Style } from './style.js';
import { Justification } from './par-style.js';
import { UnderlineMode } from './run-style.js';
import { WordDocument } from './word-document.js';
import { VirtualFlow } from './virtual-flow.js';
import { WordParagraph } from './word-paragraph.js';
import { FlowPosition } from './flow-position.js';
import { LineInRun, WordRun } from './word-run.js';

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
    const flow = new VirtualFlow(this.svg.parentElement!, doc);
    const pos = new FlowPosition(20);
    doc.paragraphs.forEach(par => {
      this.renderParagraph(par, flow, pos);
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

  private renderParagraph(par: WordParagraph, flow: VirtualFlow, pos: FlowPosition): void {
    let firstRun = true;
    if (par.numberingRun !== undefined) {
      this.renderRun(par.numberingRun, flow, pos.clone(), firstRun);
    }
    par.runs.forEach(run => {
      this.renderRun(run, flow, pos, firstRun);
      firstRun = false;
    });
  }

  private renderRun(run: WordRun, flow: VirtualFlow, pos: FlowPosition, firstRun: boolean): void {
    const width = flow.getWidth(pos);
    let remainder = run.text;
    const deltaY = run.style.fontSize * 1.08;
    if (width < 0 || !run.text) {
      pos.add(deltaY);
      return;
    }
    let inParagraph = (firstRun) ? LineInRun.FirstLine : LineInRun.Normal;
    while (remainder.length > 0) {
      const line = this.fitText(remainder, run.style, width);
      // Check for last line of run.
      if (line.length !== remainder.length) {
        if (inParagraph == LineInRun.FirstLine) {
          inParagraph = LineInRun.OnlyLine;
        } else {
          inParagraph = LineInRun.LastLine;
        }
      }
      this.addText(line, run.style, flow, pos.add(deltaY), inParagraph);
      remainder = remainder.substring(line.length);
      inParagraph = LineInRun.Normal;
    }
  }

  private stripLastWord(text: string): string {
    const stop = text.lastIndexOf(' ');
    return text.substring(0, stop);
  }

  private fitText(
    text: string,
    style: Style,
    width: number
  ): string {
    let subText = text;
    while (Metrics.getTextWidth(subText, style) + style.identation > width) {
      subText = this.stripLastWord(subText);
    }
    return subText;
  }

  private addText(
    text: string,
    style: Style,
    flow: VirtualFlow,
    pos: FlowPosition,
    inParagraph: LineInRun
  ): void {
    const newText = document.createElementNS(SvgRenderer.svgNS, 'text');
    if (style.caps) {
      text = text.toLocaleUpperCase();
    }
    this.setFont(newText, style);
    this.setHorizontalAlignment(newText, style, flow, pos, inParagraph);
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

  private setHorizontalAlignment(textNode: Element, style: Style, flow: VirtualFlow, pos: FlowPosition, inParagraph: LineInRun): void {
    const xDelta = (inParagraph === LineInRun.FirstLine || inParagraph === LineInRun.OnlyLine) ? style.hanging : style.identation;
    const x = flow.getX(pos) + xDelta;
    const width = flow.getWidth(pos);
    switch(style.justification) {
      case Justification.both:
        textNode.setAttribute('x', x.toString());
        if (inParagraph === LineInRun.LastLine || inParagraph === LineInRun.OnlyLine) {
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
  }

  private renderUnderline(textNode: Element, style: Style, flow: VirtualFlow, pos: FlowPosition): void {
    // TODO: Support all underline modes
    // TODO: Support strike and dstrike
    if (style.underlineMode !== UnderlineMode.none || style.strike || style.doubleStrike) {
      let lineLength = (textNode as any).getComputedTextLength();
      const y = pos.clone().add(style.fontSize / 2);
      switch(style.underlineMode) {
        case UnderlineMode.double:
            this.renderHorizontalLine(lineLength, flow, y.add(style.fontSize / 10), style.color);
            this.renderHorizontalLine(lineLength, flow, y.add(style.fontSize / 10), style.color);
            break;
        default:
        case UnderlineMode.single:
            this.renderHorizontalLine(lineLength, flow, y.add(style.fontSize / 10), style.color);
            break;
      }
      if (style.strike) {
        this.renderHorizontalLine(lineLength, flow, y.subtract(style.fontSize / 2), style.color);
      }
      if (style.doubleStrike) {
        const middle = y.subtract(style.fontSize / 2);
        this.renderHorizontalLine(lineLength, flow, middle.subtract(1), style.color);
        this.renderHorizontalLine(lineLength, flow, middle.add(2), style.color);
      }
    }
  }

  private renderHorizontalLine(lineLength: number, flow: VirtualFlow, pos: FlowPosition, color: string) {
    const line = document.createElementNS(SvgRenderer.svgNS, "line");
    const x = flow.getX(pos);
    const y = flow.getY(pos);
    line.setAttribute("x1", x.toString());
    line.setAttribute("y1", y.toString());
    line.setAttribute("x2", (x + lineLength).toString());
    line.setAttribute("y2", y.toString());
    line.setAttribute("stroke", `#${color}`);
    this.svg.appendChild(line);
  }
}
