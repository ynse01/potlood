import { Fonts } from "./fonts.js";
import { Style } from "../text/style.js";
import { Metrics } from "./metrics.js";
export class FontMetrics {
    static fitCharacters(width, style) {
        const charWidth = FontMetrics.averageCharWidth(style);
        return Math.floor(width / charWidth);
    }
    static averageCharWidth(style) {
        const fontSize = style.fontSize;
        const fontFamily = style.fontFamily;
        Fonts.tryAddFont(fontFamily, style.bold);
        const metric = this.getFontMetrics(style);
        const width = metric.width / this._testString.length;
        const charWidth = width * fontSize / this._testSize;
        return charWidth;
    }
    static getTotalHeight(style) {
        const metric = this.getFontMetrics(style);
        const testHeight = metric.fontBoundingBoxAscent + metric.fontBoundingBoxDescent;
        return testHeight * style.fontSize / this._testSize;
    }
    static getTopToBaseline(style) {
        const metric = this.getFontMetrics(style);
        const testHeight = metric.fontBoundingBoxAscent || this._testSize * 0.75;
        return testHeight * style.fontSize / this._testSize;
    }
    static getBaselineToBottom(style) {
        const metric = this.getFontMetrics(style);
        const testHeight = metric.fontBoundingBoxDescent || this._testSize / 4;
        return testHeight * style.fontSize / this._testSize;
    }
    static getFontMetrics(style) {
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
FontMetrics._fonts = {};
FontMetrics._testString = "The quick brown fox jumped over the fence";
FontMetrics._testSize = 72;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9udC1tZXRyaWNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL2ZvbnQtbWV0cmljcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUN6QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRXZDLE1BQU0sT0FBTyxXQUFXO0lBS2IsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFhLEVBQUUsS0FBWTtRQUNuRCxNQUFNLFNBQVMsR0FBRyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEQsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRU0sTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQVk7UUFDdkMsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUNoQyxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQ3BDLEtBQUssQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFDLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7UUFDckQsTUFBTSxTQUFTLEdBQUcsS0FBSyxHQUFHLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ3BELE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFFTSxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQVk7UUFDckMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxQyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMscUJBQXFCLEdBQUcsTUFBTSxDQUFDLHNCQUFzQixDQUFDO1FBQ2hGLE9BQU8sVUFBVSxHQUFHLEtBQUssQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN4RCxDQUFDO0lBRU0sTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQVk7UUFDdkMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxQyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMscUJBQXFCLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDekUsT0FBTyxVQUFVLEdBQUcsS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hELENBQUM7SUFFTSxNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBWTtRQUMxQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFDLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxzQkFBc0IsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUN2RSxPQUFPLFVBQVUsR0FBRyxLQUFLLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDeEQsQ0FBQztJQUVPLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBWTtRQUN0QyxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsVUFBVSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMxRCxJQUFJLE9BQU8sR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3JDLElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtZQUN2QixNQUFNLFdBQVcsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ2hDLFdBQVcsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDOUUsT0FBTyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztTQUMxRTtRQUNELE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7O0FBOUNjLGtCQUFNLEdBQW1DLEVBQUUsQ0FBQztBQUM1Qyx1QkFBVyxHQUFHLDJDQUEyQyxDQUFDO0FBQzFELHFCQUFTLEdBQUcsRUFBRSxDQUFDIn0=