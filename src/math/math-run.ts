import { IRun } from "../paragraph/paragraph.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { Equation } from "./equation.js";
import { Size } from "../utils/math/size.js";

export class MathRun implements IRun {
    public previousXPos: number | undefined;
    public lastXPos: number | undefined;
    public equation: Equation;
    private _size: Size | undefined = undefined;

    constructor(equation: Equation) {
        this.equation = equation;
    }

    public getUsedWidth(): number {
        if (this._size === undefined) {
            this._size = this.equation.objects.getSize();
        }
        return this._size!.width;
    }

    public getHeight(): number {
        if (this._size === undefined) {
            this._size = this.equation.objects.getSize();
        }
        return this._size!.height;
    }
    
    public performLayout(flow: VirtualFlow): void {
        const padding = this.previousXPos || flow.getX();
        this.lastXPos = this.equation.objects.performLayout(flow, padding);
    }


}