import { Xml } from "../utils/xml.js";
import { Fonts } from "../utils/fonts.js";
import { Metrics } from "../utils/metrics.js";
import { Style } from "./style.js";
import { NamedStyles } from "./named-styles.js";

export enum UnderlineMode {
    none = "none",
    dash = "dash",
    dashDotDotHeavy = "dashDotDotHeavy",
    dashDotHeavy = "dashDotHeavy",
    dashedHeavy = "dashedHeavy",
    dashLong = "dashLong",
    dashLongHeavy = "dashLongHeavy",
    dotDash = "dotDash",
    dotDotDash = "dotDotDash",
    dotted = "dotted",
    dottedHeavy = "dottedHeavy",
    double = "double",
    single = "single",
    thick = "thick",
    wave = "wave",
    wavyDouble = "wavyDouble",
    wavyHeavy = "wavyHeavy",
    words = "words"
}

export class RunStyle {
    public _basedOn: Style | undefined;
    private _basedOnId: string | undefined;
    public _italic: boolean | undefined;
    public _bold: boolean | undefined;
    public _underlineMode: UnderlineMode | undefined;
    public _strike: boolean | undefined;
    public _dstrike: boolean | undefined;
    public _fontFamily: string | undefined;
    public _fontSize: number | undefined;
    public _charSpacing: number | undefined;
    public _charStretch: number | undefined;
    public _color: string | undefined;
    public _caps: boolean | undefined;
    public _smallCaps: boolean | undefined;
    public _shadingColor: string | undefined;
    public _invisible: boolean | undefined;

    public static fromPresentationNode(runPresentationNode: ChildNode): RunStyle {
        // TODO: Handle themeShade, themeTint, em, emboss, fitText, imprint, outline, position, shadow, vanish, vertAlign
        const style = new RunStyle();
        runPresentationNode.childNodes.forEach(child => {
            switch(child.nodeName) {
                case "w:rStyle":
                    style._basedOnId = Xml.getStringValue(child);
                    break;
                case "w:b":
                    style._bold = Xml.getBooleanValue(child);
                    break;
                case "w:i":
                    style._italic = Xml.getBooleanValue(child);
                    break;
                case "w:shd":
                    style._shadingColor = Style.readShading(child);
                    break;
                case "w:u":
                    const underlineMode = Xml.getStringValue(child);
                    if (underlineMode !== undefined) {
                        style._underlineMode = UnderlineMode[underlineMode as keyof typeof UnderlineMode];
                    }
                    break;
                case "w:strike":
                    style._strike = Xml.getBooleanValue(child);
                    break;
                case "w:dstrike":
                    style._dstrike = Xml.getBooleanValue(child);
                    break;
                case "w:rFonts":
                    const families = RunStyle.readFontFamily(child);
                    if (families !== undefined) {
                        style._fontFamily = families[Fonts.tryAddFonts(families)];
                    } else {
                        style._fontFamily = undefined;
                    }
                    break;
                case "w:sz":
                    style._fontSize = RunStyle.readFontSize(child);
                    break;
                case "w:spacing":
                    const spacingTwips = Xml.getNumberValue(child);
                    if (spacingTwips !== undefined) {
                        style._charSpacing = Metrics.convertTwipsToPixels(spacingTwips);
                    }
                    break;
                case "w:w":
                    const stretchPercent =  Xml.getNumberValue(child);
                    if (stretchPercent !== undefined) {
                        style._charStretch = stretchPercent / 100;
                    }
                    break;
                case "w:color":
                    style._color = Xml.getStringValue(child);
                    ;break;
                case "w:caps":
                    style._caps = Xml.getBooleanValue(child);
                    break;
                case "w:smallCaps":
                    style._smallCaps = Xml.getBooleanValue(child);
                    break;
                case "w:vanish":
                    style._invisible = true;
                    break;
                case "w:szCs":
                case "w:iCs":
                case "w:bCs":
                case "w:lang":
                        // Ignore
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during RunStyle reading.`);
                    break;
            }
        });
        return style;
    }

    public applyNamedStyles(namedStyles: NamedStyles | undefined): void {
        if (this._basedOnId !== undefined && namedStyles !== undefined) {
            const baseStyle = namedStyles.getNamedStyle(this._basedOnId);
            if (baseStyle !== undefined) {
                this._basedOn = baseStyle;
            }
        }
    }

    public updateFont(fontFamily: string, bold: boolean, fontSize: number): void {
        this._fontFamily = fontFamily;
        this._bold = bold;
        this._fontSize = fontSize;
    }

    public toString(): string {
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
    private static readFontFamily(fontNode: ChildNode): string[] | undefined {
        let fonts: string[] | undefined = undefined;
        const asciiFont = Xml.getAttribute(fontNode, "w:ascii");
        if (asciiFont !== undefined) {
            fonts = asciiFont.split(';');
        }
        return fonts;
    }

    private static readFontSize(sizeNode: ChildNode): number | undefined {
        const sizeInPoints = Xml.getNumberValue(sizeNode);
        return (sizeInPoints !== undefined) ? Metrics.convertPointToFontSize(sizeInPoints) : undefined;
    }
}