import { IPainter, IRectangle } from "./i-painter.js";
import { Justification } from "../paragraph/par-style.js";
import { Picture } from "../drawing/picture.js";
export declare class CanvasPainter implements IPainter {
    private _canvas;
    private _context;
    private _lastText;
    private _lastX;
    private _lastY;
    private _invisible;
    constructor(content: HTMLElement);
    paintText(x: number, y: number, _width: number, _fitWidth: boolean, text: string, color: string, _justification: Justification, fontFamily: string, fontSize: number, bold: boolean, italic: boolean): void;
    measureLastText(): IRectangle;
    paintLine(x1: number, y1: number, x2: number, y2: number, color: string, thickness: number): void;
    paintPicture(x: number, y: number, _width: number, _height: number, pic: Picture): void;
    clear(): void;
    ensureHeight(height: number): void;
}
