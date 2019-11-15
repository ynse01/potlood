import { InSequence } from "../utils/in-sequence.js";
import { Justification } from "../paragraph/par-style.js";


export interface IPositionedTextLine {
    text: string;
    x: number;
    y: number;
    width: number;
    fitWidth: boolean;
    following: boolean;
    inRun: InSequence;
    justification?: Justification
}

export interface IPositionedLine {
    x1: number,
    x2: number,
    y1: number,
    y2: number
}