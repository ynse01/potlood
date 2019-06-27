import { Metrics } from './metrics.js';
import { Style } from './style.js';
import { Justification } from './par-style.js';
import { UnderlineMode } from './run-style.js';
import { WordDocument } from './word-document.js';
import { VirtualFlow } from './virtual-flow.js';
import { Paragraph, RunInParagraph } from './paragraph.js';
import { FlowPosition } from './flow-position.js';
import { LineInRun, Run } from './run.js';

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

  private renderParagraph(par: Paragraph, flow: VirtualFlow, pos: FlowPosition): void {
    if (par.numberingRun !== undefined) {
      this.renderRun(par.numberingRun, flow, pos.clone(), RunInParagraph.FirstRun);
    }
    par.runs.forEach((run, index, runs) => {
      let inParagraph = RunInParagraph.Normal;
      if (runs.length === 1) {
        inParagraph = RunInParagraph.OnlyRun;
      } else if (index === 0) {
        inParagraph = RunInParagraph.FirstRun;
      } else if (index === runs.length - 1) {
        inParagraph = RunInParagraph.LastRun;
      }
      this.renderRun(run, flow, pos, inParagraph);
    });
  }

  private renderRun(run: Run, flow: VirtualFlow, pos: FlowPosition, inParagraph: RunInParagraph): void {
    let width = flow.getWidth(pos);
    let remainder = run.text;
    const deltaY = run.style.fontSize * 1.08;
    if (inParagraph === RunInParagraph.FirstRun || inParagraph === RunInParagraph.OnlyRun) {
      pos.add(deltaY);
    }
    if (width < 0 || !run.text) {
      return;
    }
    let inRun = (inParagraph === RunInParagraph.FirstRun || inParagraph === RunInParagraph.OnlyRun) ? LineInRun.FirstLine : LineInRun.Normal;
    while (remainder.length > 0) {
      width = flow.getWidth(pos);
      const line = this.fitText(remainder, run.style, width);
      let usedWidth = 0;
      // Check for last line of run.
      if (line.length === remainder.length) {
        if (inRun == LineInRun.FirstLine) {
          inRun = LineInRun.OnlyLine;
        } else {
          inRun = LineInRun.LastLine;
        }
        if (inParagraph !== RunInParagraph.LastRun && inParagraph !== RunInParagraph.OnlyRun) {
          usedWidth = Metrics.getTextWidth(line, run.style) - run.style.identation;
        }
      }
      this.addText(line, run.style, flow, pos, inRun);
      if (usedWidth > 0) {
        flow.useWidth(pos, usedWidth);
      } else {
        pos.add(deltaY);
      }
      remainder = remainder.substring(line.length);
      inRun = LineInRun.Normal;
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
    inRun: LineInRun
  ): void {
    const newText = document.createElementNS(SvgRenderer.svgNS, 'text');
    if (style.caps) {
      text = text.toLocaleUpperCase();
    }
    this.setFont(newText, style);
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
  }

  private renderUnderline(textNode: Element, style: Style, flow: VirtualFlow, pos: FlowPosition): void {
    // TODO: Support all underline modes
    if (style.underlineMode !== UnderlineMode.none || style.strike || style.doubleStrike) {
      let lineLength = (textNode as any).getComputedTextLength();
      const y = pos.clone().add(style.fontSize / 2);
      switch(style.underlineMode) {
        case UnderlineMode.double:
          this.renderHorizontalLine(lineLength, flow, y.add(style.fontSize / 10), style.color);
          this.renderHorizontalLine(lineLength, flow, y.add(style.fontSize / 10), style.color);
          break;
        case UnderlineMode.none:
          // Nothing to be done
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
