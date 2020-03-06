import { ILayoutable } from "../utils/i-layoutable.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { MathObjectList } from "./math-object.js";

export class Equation implements ILayoutable {
    public objects: MathObjectList;

    constructor(objects: MathObjectList) {
        this.objects = objects;
    }

    public performLayout(flow: VirtualFlow): void {
        this.objects.forEach(obj => obj.performLayout(flow));
    }

}