import { Style } from "./style.js";
import { NamedStyles } from "./named-styles.js";
export declare enum UnderlineMode {
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
export declare class RunStyle {
    _basedOn: Style | undefined;
    private _basedOnId;
    _italic: boolean | undefined;
    _bold: boolean | undefined;
    _underlineMode: UnderlineMode | undefined;
    _strike: boolean | undefined;
    _dstrike: boolean | undefined;
    _fontFamily: string | undefined;
    _fontSize: number | undefined;
    _charSpacing: number | undefined;
    _charStretch: number | undefined;
    _color: string | undefined;
    _caps: boolean | undefined;
    _smallCaps: boolean | undefined;
    _shadingColor: string | undefined;
    _invisible: boolean | undefined;
    static fromPresentationNode(runPresentationNode: ChildNode): RunStyle;
    applyNamedStyles(namedStyles: NamedStyles | undefined): void;
    updateFont(fontFamily: string, bold: boolean, fontSize: number): void;
    toString(): string;
    /**
     * Return fonts from specified node in reverse order.
     */
    private static getFontFamilyFromNode;
    private static getFontSizeFromNode;
}
