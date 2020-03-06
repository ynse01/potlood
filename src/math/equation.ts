import { ILayoutable } from "../utils/i-layoutable.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { IPainter } from "../painting/i-painter.js";


export abstract class MathObject {
    public abstract performLayout(flow: VirtualFlow): void;

    public abstract render(painter: IPainter): void;
}

export class NAryObject implements MathObject {
    public performLayout(_flow: VirtualFlow): void {
        throw new Error("Method not implemented.");
    }
    
    public render(_painter: IPainter): void {
        throw new Error("Method not implemented.");
    }
}

export class DelimiterObject implements MathObject {
    public performLayout(_flow: VirtualFlow): void {
        throw new Error("Method not implemented.");
    }
    
    public render(_painter: IPainter): void {
        throw new Error("Method not implemented.");
    }
}

export class RunObject implements MathObject {
    public performLayout(_flow: VirtualFlow): void {
        throw new Error("Method not implemented.");
    }
    
    public render(_painter: IPainter): void {
        throw new Error("Method not implemented.");
    }
}

export class Equation implements ILayoutable {
    public objects: MathObject[] = [];

    public performLayout(flow: VirtualFlow): void {
        this.objects.forEach(obj => obj.performLayout(flow));
    }

}