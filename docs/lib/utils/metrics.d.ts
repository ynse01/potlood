import { Style } from "../text/style.js";
export declare class Metrics {
    /**
     * Convert twentieths of a point in DocX coordinates to SVG pixels.
     * @param twips Twentieths of a point.
     */
    static convertTwipsToPixels(twips: number): number;
    /**
     * Convert a number of point in DocX coordinates to SVG pixels.
     * @param points DocX point.
     */
    static convertPointToPixels(points: number): number;
    /**
     * Convert EMU's (used in DrawingML) to SVG pixels.
     * @param emu EMU's to convert into pixels.
     */
    static convertEmuToPixels(emu: number): number;
    /**
     * Convert a number of point in Word coordinates to SVG font size
     * @param points Word point.
     */
    static convertPointToFontSize(points: number): number;
    /**
     * Convert rotation to radians.
     * @param rot Rotation in 60000th of a degree.
     */
    static convertRotationToRadians(rot: number): number;
    static getTextWidth(text: string, style: Style): number;
    static getTextWidthFromSvg(text: string, style: Style): number;
    static getTextWidthFromCanvas(text: string, style: Style): number;
    static getTextMetrics(text: string, style: Style): TextMetrics;
    static init(): void;
    private static canvas;
    private static context;
    private static svg;
}
