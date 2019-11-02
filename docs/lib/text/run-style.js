import { Xml } from "../utils/xml.js";
import { Fonts } from "../utils/fonts.js";
import { Metrics } from "../utils/metrics.js";
import { Style } from "./style.js";
export var UnderlineMode;
(function (UnderlineMode) {
    UnderlineMode["none"] = "none";
    UnderlineMode["dash"] = "dash";
    UnderlineMode["dashDotDotHeavy"] = "dashDotDotHeavy";
    UnderlineMode["dashDotHeavy"] = "dashDotHeavy";
    UnderlineMode["dashedHeavy"] = "dashedHeavy";
    UnderlineMode["dashLong"] = "dashLong";
    UnderlineMode["dashLongHeavy"] = "dashLongHeavy";
    UnderlineMode["dotDash"] = "dotDash";
    UnderlineMode["dotDotDash"] = "dotDotDash";
    UnderlineMode["dotted"] = "dotted";
    UnderlineMode["dottedHeavy"] = "dottedHeavy";
    UnderlineMode["double"] = "double";
    UnderlineMode["single"] = "single";
    UnderlineMode["thick"] = "thick";
    UnderlineMode["wave"] = "wave";
    UnderlineMode["wavyDouble"] = "wavyDouble";
    UnderlineMode["wavyHeavy"] = "wavyHeavy";
    UnderlineMode["words"] = "words";
})(UnderlineMode || (UnderlineMode = {}));
export class RunStyle {
    static fromPresentationNode(runPresentationNode) {
        // TODO: Handle themeShade, themeTint, em, emboss, fitText, imprint, outline, position, shadow, vanish, vertAlign
        const style = new RunStyle();
        style._basedOnId = Xml.getStringValueFromNode(runPresentationNode, "w:rStyle");
        style._bold = Xml.getBooleanValueFromNode(runPresentationNode, "w:b");
        style._italic = Xml.getBooleanValueFromNode(runPresentationNode, "w:i");
        style._shadingColor = Style.getShadingFromNode(runPresentationNode);
        const underlineMode = Xml.getStringValueFromNode(runPresentationNode, "w:u");
        if (underlineMode !== undefined) {
            style._underlineMode = UnderlineMode[underlineMode];
        }
        style._strike = Xml.getBooleanValueFromNode(runPresentationNode, "w:strike");
        style._dstrike = Xml.getBooleanValueFromNode(runPresentationNode, "w:dstrike");
        const families = RunStyle.getFontFamilyFromNode(runPresentationNode);
        if (families !== undefined) {
            style._fontFamily = families[Fonts.tryAddFonts(families)];
        }
        else {
            style._fontFamily = undefined;
        }
        style._fontSize = RunStyle.getFontSizeFromNode(runPresentationNode);
        const spacingTwips = Xml.getNumberValueFromNode(runPresentationNode, "w:spacing");
        if (spacingTwips !== undefined) {
            style._charSpacing = Metrics.convertTwipsToPixels(spacingTwips);
        }
        const stretchPercent = Xml.getNumberValueFromNode(runPresentationNode, "w:w");
        if (stretchPercent !== undefined) {
            style._charStretch = stretchPercent / 100;
        }
        style._color = Xml.getStringValueFromNode(runPresentationNode, "w:color");
        style._caps = Xml.getBooleanValueFromNode(runPresentationNode, "w:caps");
        style._smallCaps = Xml.getBooleanValueFromNode(runPresentationNode, "w:smallcaps");
        const vanish = Xml.getFirstChildOfName(runPresentationNode, "w:vanish");
        if (vanish !== undefined) {
            style._invisible = true;
        }
        return style;
    }
    applyNamedStyles(namedStyles) {
        if (this._basedOnId !== undefined && namedStyles !== undefined) {
            const baseStyle = namedStyles.getNamedStyle(this._basedOnId);
            if (baseStyle !== undefined) {
                this._basedOn = baseStyle;
            }
        }
    }
    updateFont(fontFamily, bold, fontSize) {
        this._fontFamily = fontFamily;
        this._bold = bold;
        this._fontSize = fontSize;
    }
    toString() {
        const i = (this._italic !== undefined) ? `i=${this._italic}` : "";
        const b = (this._bold !== undefined) ? `b=${this._bold.toString()}` : "";
        const u = (this._underlineMode !== undefined) ? `u=${this._underlineMode.toString()}` : "";
        const strike = (this._strike !== undefined) ? `strike=${this._strike.toString()}` : "";
        const font = (this._fontFamily !== undefined) ? `font=${this._fontFamily.toString()}` : "";
        const size = (this._fontSize !== undefined) ? `size=${this._fontSize.toString()}` : "";
        const dstrike = (this._dstrike !== undefined) ? `dstrike=${this._dstrike.toString()}` : "";
        const charSpacing = (this._charSpacing !== undefined) ? `char_spacing=${this._charSpacing.toString()}` : "";
        const charStretch = (this._charStretch !== undefined) ? `char_stretch=${this._charStretch.toString()}` : "";
        const color = (this._color !== undefined) ? `color=${this._color.toString()}` : "";
        const caps = (this._caps !== undefined) ? `caps=${this._caps.toString()}` : "";
        const smallcaps = (this._smallCaps !== undefined) ? `smallcaps=${this._smallCaps.toString()}` : "";
        return `RunStyle: ${i} ${b} ${u} ${strike} ${font} ${size} ${dstrike} ${charSpacing} ${charStretch} ${color} ${caps} ${smallcaps}`;
    }
    /**
     * Return fonts from specified node in reverse order.
     */
    static getFontFamilyFromNode(styleNode) {
        let fonts = undefined;
        const fontNode = Xml.getFirstChildOfName(styleNode, "w:rFonts");
        if (fontNode !== undefined) {
            const asciiFont = Xml.getAttribute(fontNode, "w:ascii");
            if (asciiFont !== undefined) {
                fonts = asciiFont.split(';');
            }
        }
        return fonts;
    }
    static getFontSizeFromNode(styleNode) {
        const sizeInPoints = Xml.getNumberValueFromNode(styleNode, "w:sz");
        return (sizeInPoints !== undefined) ? Metrics.convertPointToFontSize(sizeInPoints) : undefined;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuLXN0eWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3RleHQvcnVuLXN0eWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN0QyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDMUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFHbkMsTUFBTSxDQUFOLElBQVksYUFtQlg7QUFuQkQsV0FBWSxhQUFhO0lBQ3JCLDhCQUFhLENBQUE7SUFDYiw4QkFBYSxDQUFBO0lBQ2Isb0RBQW1DLENBQUE7SUFDbkMsOENBQTZCLENBQUE7SUFDN0IsNENBQTJCLENBQUE7SUFDM0Isc0NBQXFCLENBQUE7SUFDckIsZ0RBQStCLENBQUE7SUFDL0Isb0NBQW1CLENBQUE7SUFDbkIsMENBQXlCLENBQUE7SUFDekIsa0NBQWlCLENBQUE7SUFDakIsNENBQTJCLENBQUE7SUFDM0Isa0NBQWlCLENBQUE7SUFDakIsa0NBQWlCLENBQUE7SUFDakIsZ0NBQWUsQ0FBQTtJQUNmLDhCQUFhLENBQUE7SUFDYiwwQ0FBeUIsQ0FBQTtJQUN6Qix3Q0FBdUIsQ0FBQTtJQUN2QixnQ0FBZSxDQUFBO0FBQ25CLENBQUMsRUFuQlcsYUFBYSxLQUFiLGFBQWEsUUFtQnhCO0FBRUQsTUFBTSxPQUFPLFFBQVE7SUFrQlYsTUFBTSxDQUFDLG9CQUFvQixDQUFDLG1CQUE4QjtRQUM3RCxpSEFBaUg7UUFDakgsTUFBTSxLQUFLLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztRQUM3QixLQUFLLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxtQkFBbUIsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUMvRSxLQUFLLENBQUMsS0FBSyxHQUFHLEdBQUcs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