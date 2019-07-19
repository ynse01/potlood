import { IPainter } from "./i-painter";

export class SvgPainter implements IPainter {
    private static readonly svgNS = 'http://www.w3.org/2000/svg';
    private _svg: SVGElement;

    constructor(svg: SVGElement) {
        this._svg = svg;
    }

    public paintText(_x: number, _y: number, _text: string): void {
        throw new Error("Method not implemented.");
    }
    
    public paintLine(x1: number, y1: number, x2: number, y2: number, color: string, thickness: number): void {
        const line = document.createElementNS(SvgPainter.svgNS, "line");
        line.setAttribute("x1", x1.toString());
        line.setAttribute("y1", y1.toString());
        line.setAttribute("x2", x2.toString());
        line.setAttribute("y2", y2.toString());
        line.setAttribute("stroke", `#${color}`);
        line.setAttribute("stroke-width", thickness.toString());
        this._svg.appendChild(line);
    }


}