import { MathObject } from "./math-object.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { IPainter } from "../painting/i-painter.js";

export class DelimiterObject extends MathObject {
    public performLayout(_flow: VirtualFlow): void {
        throw new Error("Method not implemented.");
    }
    
    public render(_painter: IPainter): void {
        throw new Error("Method not implemented.");
    }
}
