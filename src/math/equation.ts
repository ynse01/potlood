import { ILayoutable } from "../utils/i-layoutable.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { MathObject } from "./math-object.js";

export class Equation implements ILayoutable {
    public objects: MathObject[] = [];

    public performLayout(flow: VirtualFlow): void {
        this.objects.forEach(obj => obj.performLayout(flow));
    }

}