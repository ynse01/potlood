import { Metrics } from './metrics.js';

export class SvgRenderer {
  private static readonly svgNS = 'http://www.w3.org/2000/svg';

  constructor(content: HTMLElement) {
    const svg = document.createElementNS(SvgRenderer.svgNS, 'svg');
    svg.setAttribute('id', 'svg');
    svg.setAttribute('width', '500');
    svg.setAttribute('height', '500');
    content.appendChild(svg);
  }

  public flowText(
    svg: SVGElement,
    text: string,
    fontFamily: string,
    fontSize: number,
    x: number,
    y: number
  ): number {
    const width = 480 - x;
    let remainder = text;
    const deltaY = fontSize * 1.08;
    if (!text) { return y + deltaY; }
    let i = 0;
    while (remainder.length > 0) {
      const line = this.fitText(remainder, fontFamily, fontSize, width);
      this.addText(svg, line, fontFamily, fontSize, x, y + i * deltaY);
      remainder = remainder.substring(line.length);
      i++;
    }
    return y + i * deltaY;
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
    svg: SVGElement,
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
    svg.appendChild(newText);
  }
}
