import { IPainter, IRectangle } from "./i-painter.js";
import { Justification } from "../paragraph/par-style.js";
import { Picture } from "../drawing/picture.js";
export declare class SvgPainter implements IPainter {
    private static readonly svgNS;
    private _svg;
    private _lastText;
    constructor(content: HTMLElement);
    readonly svg: Element;
    paintText(x: number, y: number, width: number, fitWidth: boolean, text: string, color: string, justification: Justification, fontFamily: string, fontSize: number, bold: boolean, italic: boolean): void;
    measureLastText(): IRectangle;
    paintLine(x1: number, y1: number, x2: number, y2: number, color: string, thickness: number): void;
    paintPicture(x: number, y: number, width: number, height: number, pic: Picture): void;
    clear(): void;
    ensureHeight(newHeight: number): void;
    private _setFont;
    private _setColor;
    private _setHorizontalAlignment;
    private _setVerticalAlignment;
}
