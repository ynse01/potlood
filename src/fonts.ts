import { Metrics } from './metrics.js';
import { Style } from './style.js';

export class Fonts {
  public static availableFonts(): string[] {
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
    return availableFonts;
  }
}
