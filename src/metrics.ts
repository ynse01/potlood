import { Style } from "./style.js";

export class Metrics {

  /**
   * Convert twentieths of a point in Word coordinates to SVG pixels.
   * @param twips Twentieths of a point.
   */
  public static convertTwipsToPixels(twips: number): number {
    // Normal screen is 28 dots per inch
    // 1440 twips = 1 inch (567 twips = 1 cm)
    return twips * 52 / 1440;
  }

  /**
   * Convert a number of point in Word coordinates to SVG pixels.
   * @param twips Word point.
   */
  public static convertPointToPixels(points: number): number {
    return Metrics.convertTwipsToPixels(points * 20);
  }

  public static getTextWidth(
    text: string,
    style: Style
  ): number {
    const canvas =
      this.canvas || (this.canvas = document.createElement('canvas'));
    const context = canvas.getContext('2d');
    context!.font = style.fontSize.toString() + 'px ' + style.fontFamily;
    const metrics = context!.measureText(text);
    return metrics.width;
  }
  private static canvas: HTMLCanvasElement | undefined;
}
