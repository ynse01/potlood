import { IPainter } from "./i-painter.js";
import { Justification } from "../text/par-style.js";

export class CanvasPainter implements IPainter {
    private _context: CanvasRenderingContext2D;
    constructor(content: HTMLElement) {
        const canvas = document.createElement('canvas');
        canvas.setAttribute('id', 'canvas');
        canvas.setAttribute('width', content.clientWidth.toString());
        canvas.setAttribute('height', '500');
        content.appendChild(canvas);
        this._context = canvas.getContext('2d')!;
    }
    
    paintText(x: number, y: number, _width: number, _fitWidth: boolean, text: string, color: string, _identation: number, _justification: Justification, fontFamily: string, fontSize: number, bold: boolean, italic: boolean): void {
        this._context.fillStyle = `#${color}`;
        const italicText = (italic) ? "italic ": "";
        const boldText = (bold) ? "bold ": "";
        const font = italicText + boldText + Math.round(fontSize) + 'px ' + fontFamily;
        this._context.font = font;
        this._context.fillText(text, x, y);
    }
    
    paintLine(x1: number, y1: number, x2: number, y2: number, color: string, thickness: number): void {
        this._context.lineWidth = thickness;
        this._context.strokeStyle = `#${color}`;
        this._context.beginPath();
        this._context.moveTo(x1, y1);
        this._context.lineTo(x2, y2);
        this._context.stroke();
    }


}