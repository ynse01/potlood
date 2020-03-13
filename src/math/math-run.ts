import { IRun } from "../paragraph/paragraph.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { Equation } from "./equation.js";

export class MathRun implements IRun {
    public previousXPos: number | undefined;
    public lastXPos: number | undefined;
    public equation: Equation;

    constructor(equation: Equation) {
        this.equation = equation;
    }

    public getUsedWidth(): number {
        return 0;
    }

    public getHeight(): number {
        return 0;
    }
    
    public performLayout(flow: VirtualFlow): void {
        this.equation.objects.performLayout(flow);
    }


}