import { Metrics } from './metrics.js';
import { Style } from './style.js';

export class SvgRenderer {
  private static readonly svgNS = 'http://www.w3.org/2000/svg';
  private svg: SVGElement;
  private x = 20;
  private width: number;

  constructor(content: HTMLElement) {
    const svg = document.createElementNS(SvgRenderer.svgNS, 'svg');
    this.width = content.clientWidth;
    svg.setAttribute('id', 'svg');
    svg.setAttribute('width', this.width.toString());
    svg.setAttribute('height', '500');
    content.appendChild(svg);
    this.svg = svg;
  }

  public flowText(
    text: string,
    style: Style,
    y: number
  ): number {
    const width = this.width - this.x - this.x;
    let remainder = text;
    const deltaY = style.fontSize * 1.08;
    if (!text) { return y + deltaY; }
    let i = 0;
    while (remainder.length > 0) {
      const line = this.fitText(remainder, style, width);
      let lineWidth = (line.length !== remainder.length) ? width : undefined;
      this.addText(line, style, y + i * deltaY, lineWidth);
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
    while (Metrics.getTextWidth(subText, style) > width) {
      subText = this.stripLastWord(subText);
    }
    return subText;
  }

  private addText(
    text: string,
    style: Style,
    y: number,
    width: number | undefined
  ): void {
    const newText = document.createElementNS(SvgRenderer.svgNS, 'text');
    y = y + style.fontSize / 2;
    if (style.caps) {
      text = text.toLocaleUpperCase();
    }
    this.setFont(newText, style);
    this.setHorizontalAlignment(newText, style, width);
    this.setVerticalAlignment(newText, style, y);
    const textNode = document.createTextNode(text);
    newText.appendChild(textNode);
    this.svg.appendChild(newText);
    // Render underline after adding text to DOM.
    this.renderUnderline(newText, style, y, width);
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

  private setHorizontalAlignment(textNode: Element, style: Style, width: number | undefined): void {
    textNode.setAttribute('x', this.x.toString());
    if (width !== undefined && style.justification === "both") {
      textNode.setAttribute('textLength', width.toString());
      textNode.setAttribute('lengthAdjust', 'spacing');
    }
  }

  private setVerticalAlignment(textNode: Element, _style: Style, y: number): void {
    textNode.setAttribute('y', y.toString());
  }

  private renderUnderline(textNode: Element, style: Style, y: number, width: number | undefined): void {
    // TODO: Support all underline modes
    // TODO: Support strike and dstrike
    if (style.underlineMode !== "none") {
      let lineLength = (width !== undefined) ? width : (textNode as any).getComputedTextLength();
      switch(style.underlineMode) {
        case "double":
            this.renderHorizontalLine(lineLength, y, style.color);
            this.renderHorizontalLine(lineLength, y + 3, style.color);
            break;
        default:
        case "single":
            this.renderHorizontalLine(lineLength, y, style.color);
            break;
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
