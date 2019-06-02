import { Metrics } from './metrics.js';
import { Style } from './style.js';

export class Fonts {
  private static _foundFonts: string[] | undefined = undefined;
  /**
   * List of available fonts on this device.
   */
  public static availableFonts(): string[] {
    if (Fonts._foundFonts == undefined) {
      const availableFonts: string[] = [];
      const families = [
        'Arial',
        'Helvetica',
        'Times',
        'Courier',
        'Verdana',
        'Georgia',
        'Garamond',
        'Comic Sans MS',
        'Trebuchet MS',
        'Arial Black',
        'Impact'
      ];
      const testString = 'mmmmmllnnrr';
      const style = new Style();
      const testSize = 72;
      style.updateFont('Times New Roman', testSize);
      const baseline = Metrics.getTextWidth(testString, style);
      availableFonts.push('Times New Roman');
      families.forEach(family => {
        style.updateFont(family, testSize);
        const width = Metrics.getTextWidth(testString, style);
        if (width !== baseline) {
          availableFonts.push(family);
        }
      });
      Fonts._foundFonts = availableFonts;
    }
    return Fonts._foundFonts;
  }
}
