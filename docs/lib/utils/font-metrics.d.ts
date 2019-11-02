import { Style } from "../text/style.js";
export declare class FontMetrics {
    private static _fonts;
    private static _testString;
    private static _testSize;
    static fitCharacters(width: number, style: Style): number;
    static averageCharWidth(style: Style): number;
    static getTotalHeight(style: Style): number;
    static getTopToBaseline(style: Style): number;
    static getBaselineToBottom(style: Style): number;
    private static getFontMetrics;
}
