import { LineInRun } from "./text-run.js";

export interface IPositionedTextLine {
    text: string;
    x: number;
    y: number;
    width: number;
    fitWidth: boolean;
    inRun: LineInRun;
}
