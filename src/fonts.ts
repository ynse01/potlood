import { Metrics } from './metrics.js';

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
    const testSize = 72;
    const baseline = Metrics.getTextWidth(
      testString,
      'Times New Roman',
      testSize
    );
    availableFonts.push('Times New Roman');
    families.forEach(family => {
      const width = Metrics.getTextWidth(testString, family, testSize);
      if (width !== baseline) {
        availableFonts.push(family);
      }
    });
    return availableFonts;
  }
}
