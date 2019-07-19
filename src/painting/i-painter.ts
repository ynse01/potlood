import { Justification } from "../text/par-style.js";

export interface IPainter {
    paintText(x: number, y: number, width: number, fitWidth: boolean, text: string, color: string, identation: number, justification: Justification, fontFamily: string, fontSize: number, bold: boolean, italic: boolean): void;

    paintLine(x1: number, y1: number, x2: number, y2: number, color: string, thickness: number): void;
}