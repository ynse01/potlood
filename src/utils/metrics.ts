import { Style } from "../text/style.js";

export class Metrics {

  /**
   * Convert twentieths of a point in DocX coordinates to SVG pixels.
   * @param twips Twentieths of a point.
   */
  public static convertTwipsToPixels(twips: number): number {
    // Normal screen is 28 dots per inch
    // 20 twips = 1 point
    // 72 points = 1 inch
    // 1440 twips = 1 inch
    // (567 twips = 1 cm)
    // (1 point = 1.333333 px)
    return twips / 15;
  }

  /**
   * Convert a number of point in DocX coordinates to SVG pixels.
   * @param points DocX point.
   */
  public static convertPointToPixels(points: number): number {
    return Metrics.convertTwipsToPixels(points * 20);
  }

  /**
   * Convert EMU's (used in DrawingML) to SVG pixels.
   * @param emu EMU's to convert into pixels.
   */
  public static convertEmuToPixels(emu: number): number {
    // 1 inch = 914400 EMU
    // 1 inch = 72 points
    // 1 point = 1270 EMU
    return Metrics.convertPointToPixels(emu / 12700);
  }

  /**
   * Convert a number of point in Word coordinates to SVG font size
   * @param points Word point.
   */
  public static convertPointToFontSize(points: number): number {
    return points * 52 / 72;
  }

  /**
   * Convert rotation to radians.
   * @param rot Rotation in 60000th of a degree.
   */
  public static convertRotationToRadians(rot: number): number {
    return (rot * Math.PI) / (180 * 60000);
  }

  public static getTextWidth(text: string, style: Style) {
    return this.getTextWidthFromCanvas(text, style);
  }

  public static getTextWidthFromSvg(text: string, style: Style) {
    var element = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    element.setAttribute('font-family', style.fontFamily);
    element.setAttribute('font-size', `${style.fontSize}`);
    if (style.bold) {
      element.setAttribute('font-weight', 'bold');
    }
    if (style.italic) {
      element.setAttribute('font-style', 'italic');
    }
    const node = document.createTextNode(text);
    element.appendChild(node);
    this.svg.appendChild(element);
    const width = element.getComputedTextLength();
    // const width = element.getBBox().width;
    // const width = element.getBoundingClientRect().width;
    this.svg.removeChild(element);
    return width;
  }

  public static getTextWidthFromCanvas(
    text: string,
    style: Style
  ): number {
    const italicText = (style.italic) ? "italic ": "";
    const boldText = (style.bold) ? "bold ": "";
    this.context.font = italicText + boldText + Math.round(style.fontSize) + 'px ' + style.fontFamily;
    const metrics = this.context.measureText(text);
    return metrics.width;
  }

  public static init(): void {
    if (this.canvas === undefined) {
      this.canvas = document.createElement('canvas');
      this.context = this.canvas.getContext('2d')!;
      this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      this.svg.setAttribute('width', '2048');
      this.svg.setAttribute('height', '240');
      this.svg.setAttribute('visibility', 'hidden');
      document.body.appendChild(this.svg);
    }
  }

  private static canvas: HTMLCanvasElement | undefined;
  private static context: CanvasRenderingContext2D;
  private static svg: SVGElement;
}
