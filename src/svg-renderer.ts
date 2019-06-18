import { Metrics } from './metrics.js';
import { Style } from './style.js';
import { Justification } from './par-style.js';
import { UnderlineMode } from './run-style.js';
import { WordDocument } from './word-document.js';
import { VirtualFlow } from './virtual-flow.js';

export class SvgRenderer {
  private static readonly svgNS = 'http://www.w3.org/2000/svg';
  private svg: SVGElement;
  private x = 40;

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
    let posY = 20;
    doc.paragraphs.forEach(par => {
      par.runs.forEach(run => {
        posY = this.flowText(run.text, run.style, flow, posY);
      });
    });
    return posY;
  }

  public flowText(
    text: string,
    style: Style,
    flow: VirtualFlow,
    y: number
  ): number {
    const width = flow.getWidth(y) - this.x - this.x;
    let remainder = text;
    const deltaY = style.fontSize * 1.08;
    if (width < 0 || !text) { return y + deltaY; }
    let i = 0;
    while (remainder.length > 0) {
      const line = this.fitText(remainder, style, width);
      let fillLine = (line.length !== remainder.length);
      this.addText(line, style, y + i * deltaY, width, fillLine);
      remainder = remainder.substring(line.length);
      i++;
    }
    const yPos = y + i * deltaY;
    return yPos;
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
    y: number,
    width: number,
    fillLine: boolean
  ): void {
    const newText = document.createElementNS(SvgRenderer.svgNS, 'text');
    y = y + style.fontSize / 2;
    if (style.caps) {
      text = text.toLocaleUpperCase();
    }
    this.setFont(newText, style);
    this.setHorizontalAlignment(newText, style, width, fillLine);
    this.setVerticalAlignment(newText, style, y);
    const textNode = document.createTextNode(text);
    newText.appendChild(textNode);
    this.svg.appendChild(newText);
    // Render underline after adding text to DOM.
    this.renderUnderline(newText, style, y);
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

  private setHorizontalAlignment(textNode: Element, style: Style, width: number, fillLine: boolean): void {
    const x = this.x + style.identation;
    switch(style.justification) {
      case Justification.both:
        textNode.setAttribute('x', x.toString());
        if (fillLine) {
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

  private setVerticalAlignment(textNode: Element, _style: Style, y: number): void {
    textNode.setAttribute('y', y.toString());
  }

  private renderUnderline(textNode: Element, style: Style, y: number): void {
    // TODO: Support all underline modes
    // TODO: Support strike and dstrike
    if (style.underlineMode !== UnderlineMode.none || style.strike || style.doubleStrike) {
      let lineLength = (textNode as any).getComputedTextLength();
      switch(style.underlineMode) {
        case UnderlineMode.double:
            this.renderHorizontalLine(lineLength, y + style.fontSize / 10, style.color);
            this.renderHorizontalLine(lineLength, y + 2 * style.fontSize / 10, style.color);
            break;
        default:
        case UnderlineMode.single:
            this.renderHorizontalLine(lineLength, y + style.fontSize / 10, style.color);
            break;
      }
      if (style.strike) {
        this.renderHorizontalLine(lineLength, y - style.fontSize / 2, style.color);
      }
      if (style.doubleStrike) {
        const middleY = y - style.fontSize / 2;
        this.renderHorizontalLine(lineLength, middleY - 1, style.color);
        this.renderHorizontalLine(lineLength, middleY + 1, style.color);
      }
    }
  }

  private renderHorizontalLine(lineLength: number, y: number, color: string) {
    const line = document.createElementNS(SvgRenderer.svgNS, "line");
    line.setAttribute("x1", this.x.toString());
    line.setAttribute("y1", y.toString());
    line.setAttribute("x2", (this.x + lineLength).toString());
    line.setAttribute("y2", y.toString());
    line.setAttribute("stroke", `#${color}`);
    this.svg.appendChild(line);
  }
}
