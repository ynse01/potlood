import { Justification } from "../paragraph/par-style.js";

/**
 * Bit flags for empasis of fonts (bold, italic, small caps).
 */
export enum Emphasis {
    Normal = 0,
    Bold = 1,
    Italic = 2,
    SmallCaps = 4
}

/**
 * A line of text with its position on the screen.
 */
export interface IPositionedTextLine {
    text: string;
    x: number;
    y: number;
    width: number;
    fitWidth: boolean;
    following: boolean;
    color: string;
    fontFamily: string;
    fontSize: number;
    emphasis: Emphasis;
    justification?: Justification
}

/**
 * Line with its position on screen.
 */
export interface IPositionedLine {
    x1: number,
    x2: number,
    y1: number,
    y2: number
}