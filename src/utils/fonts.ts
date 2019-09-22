import { Metrics } from './metrics.js';
import { Style } from '../text/style.js';
import { RunStyle } from '../text/run-style.js';

export class Fonts {
  private static _initialized = false;
  private static _foundFonts: { [key: string]: number } = {};
  private static _notFoundFonts: { [key: string]: number } = {};
  private static testString = 'mmmmmllnnrr';
  private static testSize = 72;
  private static baseline: number | undefined = undefined;
  
  /**
   * List of available fonts on this device.
   */
  public static availableFonts(): { [key: string]: number } {
    if (!Fonts._initialized) {
      Fonts._initialized = true;
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
      const style = new Style();
      style.runStyle = new RunStyle();
      style.runStyle.updateFont('Times New Roman', Fonts.testSize);
      Fonts.baseline = Metrics.getTextWidth(Fonts.testString, style);
      Fonts._foundFonts['Times New Roman'] = Fonts.baseline;
      families.forEach(family => {
        Fonts.testFont(family);
      });
    }
    return Fonts._foundFonts;
  }

  public static tryAddFont(family: string): boolean {
    const isAvailable = Fonts.availableFonts()[family] !== undefined;
    if (!isAvailable) {
      const isNotAvailable = Fonts._notFoundFonts[family] !== undefined;
      if (!isNotAvailable) {
        return Fonts.testFont(family);
      } 
      return false;
    }
    return true;
  }

  public static tryAddFonts(families: string[]): number {
    let index = Math.max(0, families.length - 1);
    while(index >= 0) {
      if (this.tryAddFont(families[index])) {
        return index;
      }
      index++;
    }
    return -1;
  }

  public static fitCharacters(width: number, style: Style): number {
    const fontSize = style.fontSize;
    const fontFamily = style.fontFamily;
    Fonts.tryAddFont(fontFamily);
    const fontWidth = Fonts._foundFonts[fontFamily];
    const charWidth = (fontWidth * fontSize / Fonts.testSize) / Fonts.testString.length;
    // Adding 20% extra seems to give better results on actual text.
    return Math.floor(width / charWidth) * 1.2;
  }

  private static testFont(family: string): boolean {
    const style = new Style();
    style.runStyle = new RunStyle();
    style.runStyle.updateFont(family, Fonts.testSize);
    const width = Metrics.getTextWidth(Fonts.testString, style);
    if (width !== Fonts.baseline) {
      Fonts._foundFonts[family] = width;
      return true;
    } else {
      Fonts._notFoundFonts[family] = width;
      return false;
    }
  }
}
