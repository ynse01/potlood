import { Fonts } from "./fonts.js";
import { Style } from "../text/style.js";
import { Metrics } from "./metrics.js";

export class FontMetrics {
    private static _fonts: { [key: string]: TextMetrics } = {};
    private static _testString = "The quick brown fox jumped over the fence";
    private static _testSize = 72;
    private static _topToBaseFactor = 13 / 16;
  
    public static fitCharacters(width: number, style: Style): number {
        const charWidth = FontMetrics.averageCharWidth(style);
        return Math.floor(width / charWidth);
    }
    
    public static averageCharWidth(style: Style): number {
        const fontSize = style.fontSize;
        const fontFamily = style.fontFamily;
        Fonts.tryAddFont(fontFamily, style.bold);
        const metric = this.getFontMetrics(style);
        const width = metric.width / this._testString.length;
        const charWidth = width * fontSize / this._testSize;
        return charWidth;
    }
 
    public static getTotalHeight(style: Style): number {
        const metric = this.getFontMetrics(style);
        const testHeight = metric.fontBoundingBoxAscent + metric.fontBoundingBoxDescent;
        return testHeight * style.fontSize / this._testSize;
    }

    public static getTopToBaseline(style: Style): number {
        const metric = this.getFontMetrics(style);
        const testHeight = metric.fontBoundingBoxAscent || this._testSize * FontMetrics._topToBaseFactor;
        return testHeight * style.fontSize / this._testSize;
    }

    public static getBaselineToBottom(style: Style): number {
        const metric = this.getFontMetrics(style);
        const baseToBottomFactor = 1 - FontMetrics._topToBaseFactor;
        const testHeight = metric.fontBoundingBoxDescent || this._testSize * baseToBottomFactor;
        return testHeight * style.fontSize / this._testSize;
    }

    private static getFontMetrics(style: Style) {
        const id = style.fontFamily + (style.bold) ? "-bold" : "";
        let metrics = FontMetrics._fonts[id];
        if (metrics === undefined) {
            const metricStyle = new Style();
            metricStyle.runStyle.updateFont(style.fontFamily, style.bold, this._testSize);
            metrics = Metrics.getTextMetrics(FontMetrics._testString, metricStyle);
        }
        return metrics;
    }
}