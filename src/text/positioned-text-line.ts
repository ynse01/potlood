import { InSequence } from "../utils/in-sequence.js";
import { Justification } from "../paragraph/par-style.js";

export enum Emphasis {
    Normal = 0,
    Bold = 1,
    Italic = 2,
    SmallCaps = 4
}

export interface IPositionedTextLine {
    text: string;
    x: number;
    y: number;
    width: number;
    fitWidth: boolean;
    following: boolean;
    inRun: InSequence;
    color: string;
    fontFamily: string;
    fontSize: number;
    emphasis: Emphasis;
    justification?: Justification
}

export interface IPositionedLine {
    x1: number,
    x2: number,
    y1: number,
    y2: number
}