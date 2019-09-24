import { InSequence } from "../utils/in-sequence.js";


export interface IPositionedTextLine {
    text: string;
    x: number;
    y: number;
    width: number;
    fitWidth: boolean;
    inRun: InSequence;
}
