
export interface IPainter {
    paintText(x: number, y: number, text: string): void;

    paintLine(x1: number, y1: number, x2: number, y2: number, color: string, thickness: number): void;
}