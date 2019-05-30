export class Metrics {

  public static getTextWidth(
    text: string,
    fontFamily: string,
    fontSize: number
  ): number {
    const canvas =
      this.canvas || (this.canvas = document.createElement('canvas'));
    const context = canvas.getContext('2d');
    context!.font = fontSize.toString() + 'px ' + fontFamily;
    const metrics = context!.measureText(text);
    return metrics.width;
  }
  private static canvas: HTMLCanvasElement | undefined;
}
