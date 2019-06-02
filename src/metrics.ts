import { Style } from "./style";

export class Metrics {

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
