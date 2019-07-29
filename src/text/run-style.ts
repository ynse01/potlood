import { Xml } from "../utils/xml.js";
import { Fonts } from "./fonts.js";
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
    public _spacing: number | undefined;
    public _color: string | undefined;
    public _caps: boolean | undefined;
    public _smallCaps: boolean | undefined;

    public static fromPresentationNode(runPresentationNode: ChildNode): RunStyle {
        const style = new RunStyle();
        style._basedOnId = Xml.getStringValueFromNode(runPresentationNode, "w:rStyle");
        style._bold = Xml.getBooleanValueFromNode(runPresentationNode, "w:b");
        style._italic = Xml.getBooleanValueFromNode(runPresentationNode, "w:i");
        const underlineMode = Xml.getStringValueFromNode(runPresentationNode, "w:u");
        if (underlineMode !== undefined) {
            style._underlineMode = UnderlineMode[underlineMode as keyof typeof UnderlineMode];
        }
        style._strike = Xml.getBooleanValueFromNode(runPresentationNode, "w:strike");
        style._dstrike = Xml.getBooleanValueFromNode(runPresentationNode, "w:dstrike");
        const families = RunStyle.getFontFamilyFromNode(runPresentationNode);
        if (families !== undefined) {
            style._fontFamily = families[Fonts.tryAddFonts(families)];
        } else {
            style._fontFamily = undefined;
        }
        style._fontSize = RunStyle.getFontSizeFromNode(runPresentationNode);
        style._spacing = Xml.getNumberValueFromNode(runPresentationNode, "w:spacing");
        style._color = Xml.getStringValueFromNode(runPresentationNode, "w:color");
        style._caps = Xml.getBooleanValueFromNode(runPresentationNode, "w:caps");
        style._smallCaps = Xml.getBooleanValueFromNode(runPresentationNode, "w:smallcaps");
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

    public updateFont(fontFamily: string, fontSize: number): void {
        this._fontFamily = fontFamily;
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
        const spacing = (this._spacing !== undefined) ? `spacing=${this._spacing.toString()}` : "";
        const color = (this._color !== undefined) ? `color=${this._color.toString()}` : "";
        const caps = (this._caps !== undefined) ? `caps=${this._caps.toString()}` : "";
        const smallcaps = (this._smallCaps !== undefined) ? `smallcaps=${this._smallCaps.toString()}` : "";
        return `RunStyle: ${i} ${b} ${u} ${strike} ${font} ${size} ${dstrike} ${spacing} ${color} ${caps} ${smallcaps}`;
    }

    /**
     * Return fonts from specified node in reverse order.
     */
    private static getFontFamilyFromNode(styleNode: ChildNode): string[] | undefined {
        let fonts: string[] | undefined = undefined;
        const fontNode = Xml.getFirstChildOfName(styleNode, "w:rFonts") as Element;
        if (fontNode !== undefined) {
            const asciiFont = Xml.getAttribute(fontNode, "w:ascii");
            if (asciiFont !== undefined) {
                fonts = asciiFont.split(';');
            }
        }
        return fonts;
    }

    private static getFontSizeFromNode(styleNode: ChildNode): number | undefined {
        const sizeInPoints = Xml.getNumberValueFromNode(styleNode, "w:sz");
        return (sizeInPoints !== undefined) ? Metrics.convertPointToFontSize(sizeInPoints) : undefined;
    }
}