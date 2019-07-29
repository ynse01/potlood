import { Justification } from "../text/par-style.js";
import { Picture } from "../drawing/picture.js";

export interface IRectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface IPainter {
    paintText(x: number, y: number, width: number, fitWidth: boolean, text: string, color: string, justification: Justification, fontFamily: string, fontSize: number, bold: boolean, italic: boolean): void;

    measureLastText(): IRectangle;

    clear(): void;

    paintLine(x1: number, y1: number, x2: number, y2: number, color: string, thickness: number): void;

    paintPicture(x: number, y: number, width: number, height: number, pic: Picture): void;
}