import { Metrics } from './metrics.js';

export class SvgRenderer {
  private static readonly svgNS = 'http://www.w3.org/2000/svg';
  private svg: SVGElement;
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
    fontFamily: string,
    fontSize: number,
    x: number,
    y: number
  ): number {
    const width = this.width - x - x;
    let remainder = text;
    const deltaY = fontSize * 1.08;
    if (!text) { return y + deltaY; }
    let i = 0;
    while (remainder.length > 0) {
      const line = this.fitText(remainder, fontFamily, fontSize, width);
      this.addText(line, fontFamily, fontSize, x, y + i * deltaY);
      remainder = remainder.substring(line.length);
      i++;
    }
    const yPos = y + i * deltaY;
    this.ensureHeight(yPos);
    return yPos;
  }

  public clear() {
    while (this.svg.lastChild) {
        this.svg.removeChild(this.svg.lastChild);
    }
  }

  private stripLastWord(text: string): string {
    const stop = text.lastIndexOf(' ');
    return text.substring(0, stop);
  }

  private fitText(
    text: string,
    fontFamily: string,
    fontSize: number,
    width: number
  ): string {
    let subText = text;
    while (Metrics.getTextWidth(subText, fontFamily, fontSize) > width) {
      subText = this.stripLastWord(subText);
    }
    return subText;
  }

  private addText(
    text: string,
    fontFamily: string,
    fontSize: number,
    x: number,
    y: number
  ): void {
    const newText = document.createElementNS(SvgRenderer.svgNS, 'text');
    newText.setAttribute('x', x.toString());
    newText.setAttribute('y', y.toString());
    newText.setAttribute('font-family', fontFamily);
    newText.setAttribute('font-size', fontSize.toString());
    const textNode = document.createTextNode(text);
    newText.appendChild(textNode);
    this.svg.appendChild(newText);
  }

  private ensureHeight(newHeight: number): void {
    const height = this.svg.getAttribute("height");
    if (height !== null) {
      const heightNum = parseFloat(height);
      const maxY = Math.max(heightNum, newHeight);
      if (maxY > heightNum) {
        this.svg.setAttribute("height", maxY.toString());
      }
    }
  }
}
