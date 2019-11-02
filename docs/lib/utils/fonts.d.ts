export declare class Fonts {
    private static _initialized;
    private static _foundFonts;
    private static _notFoundFonts;
    private static testString;
    private static testSize;
    private static baseline;
    /**
     * List of available fonts on this device.
     */
    static availableFonts(): {
        [key: string]: number;
    };
    static tryAddFonts(families: string[]): number;
    static tryAddFont(family: string, bold: boolean): boolean;
    private static testFont;
    private static _getName;
}
