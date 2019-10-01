import { Metrics } from './metrics.js';
import { Style } from '../text/style.js';

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
      style.runStyle.updateFont('Times New Roman', false, Fonts.testSize);
      Fonts.baseline = Metrics.getTextWidth(Fonts.testString, style) / Fonts.testString.length;
      Fonts._foundFonts['Times New Roman'] = Fonts.baseline;
      families.forEach(family => {
        Fonts.testFont(family, false);
      });
    }
    return Fonts._foundFonts;
  }

  public static tryAddFonts(families: string[]): number {
    for (let i = 0; i < families.length; i++) {
      if (this.tryAddFont(families[i], false)) {
        return i;
      }
    }
    return -1;
  }

  public static tryAddFont(family: string, bold: boolean): boolean {
    const name = Fonts._getName(family, bold);
    const isAvailable = Fonts.availableFonts()[name] !== undefined;
    if (!isAvailable) {
      const isNotAvailable = Fonts._notFoundFonts[name] !== undefined;
      if (!isNotAvailable) {
        return Fonts.testFont(family, bold);
      } 
      return false;
    }
    return true;
  }

  public static fitCharacters(width: number, style: Style): number {
    const charWidth = Fonts.averageCharWidth(style);
    return Math.floor(width / charWidth);
  }

  public static averageCharWidth(style: Style): number {
    const fontSize = style.fontSize;
    const fontFamily = style.fontFamily;
    Fonts.tryAddFont(fontFamily, style.bold);
    const fontWidth = Fonts._foundFonts[fontFamily];
    const charWidth = fontWidth * fontSize / Fonts.testSize;
    // Reduce 20% seems to give better results on actual text.
    return charWidth / 1.2;
  }

  private static testFont(family: string, bold: boolean): boolean {
    const style = new Style();
    style.runStyle.updateFont(family, bold, Fonts.testSize);
    const name = Fonts._getName(family, bold);
    const widthOfString = Metrics.getTextWidth(Fonts.testString, style);
    const widthOfChar = widthOfString / Fonts.testString.length;
    if (widthOfChar !== Fonts.baseline) {
      Fonts._foundFonts[name] = widthOfChar;
      return true;
    } else {
      Fonts._notFoundFonts[name] = widthOfChar;
      return false;
    }
  }

  private static _getName(family: string, bold: boolean): string {
    return family + ((bold) ? "-bold" : "");
  }
}
