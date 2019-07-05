import { Style } from "./style.js";

export class Metrics {

  /**
   * Convert twentieths of a point in Word coordinates to SVG pixels.
   * @param twips Twentieths of a point.
   */
  public static convertTwipsToPixels(twips: number): number {
    // Normal screen is 28 dots per inch
    // 20 twips = 1 point
    // 72 points = 1 inch
    // 1440 twips = 1 inch
    // (567 twips = 1 cm)
    // (1 point = 1.333333 px)
    return twips * 4 / 60;
  }

  /**
   * Convert a number of point in Word coordinates to SVG pixels.
   * @param points Word point.
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
    return Metrics.convertPointToPixels(emu / 1270);
  }

  /**
   * Convert a number of point in Word coordinates to SVG font size
   * @param points Word point.
   */
  public static convertPointToFontSize(points: number): number {
    return points * 20 * 52 / 1440;
  }

  /**
   * Returns the spcing between two consequative lines.
   */
  public static getLineSpacing(style: Style): number {
    return 1.08 * style.fontSize;
  }

  /**
   * Convert rotation to radians.
   * @param rot Rotation in 60000th of a degree.
   */
  public static convertRotationToRadians(rot: number): number {
    return (rot * Math.PI) / (180 * 60000);
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
