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
      this.addText(line, style, y + i * deltaY);
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
    y: number
  ): void {
    const newText = document.createElementNS(SvgRenderer.svgNS, 'text');
    y = y + style.fontSize / 2;
    newText.setAttribute('x', this.x.toString());
    newText.setAttribute('y', y.toString());
    newText.setAttribute('font-family', style.fontFamily);
    newText.setAttribute('font-size', style.fontSize.toString());
    if (style.bold) {
      newText.setAttribute('font-weight', 'bold');
    }
    if (style.italic) {
      newText.setAttribute('font-style', 'italic');
    }
    if (style.caps) {
      text = text.toLocaleUpperCase();
    }
    const textNode = document.createTextNode(text);
    newText.appendChild(textNode);
    this.svg.appendChild(newText);
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
}
