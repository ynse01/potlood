import { FlowPosition } from "../flow-position.js";
import { LineInRun } from "./text-run.js";

export interface IPositionedTextLine {
    text: string;
    pos: FlowPosition;
    claim: number;
    inRun: LineInRun;
}
