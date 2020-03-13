import { IPainter } from "../painting/i-painter";
import { MathRun } from "./math-run";


export class MathRenderer {
    private _painter: IPainter;

    constructor(painter: IPainter) {
        this._painter = painter;
    }

    public renderMathRun(run: MathRun): void {
        const objs = run.equation.objects;
        objs.forEach(obj => {
            obj.render(this._painter);
        });
    }
}