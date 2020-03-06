import { IRun } from "../paragraph/paragraph.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { Equation } from "./equation.js";

export class MathRun implements IRun {
    public previousXPos: number | undefined;
    public lastXPos: number | undefined;

    constructor(_equation: Equation) {
    }

    public getUsedWidth(): number {
        return 0;
    }

    public getHeight(): number {
        return 0;
    }
    
    public performLayout(_flow: VirtualFlow): void {
        // Nothing to do yet.
    }


}