import { VirtualFlow } from "../utils/virtual-flow.js";
import { IPainter } from "../painting/i-painter.js";

export abstract class MathObject {
    public abstract performLayout(flow: VirtualFlow): void;

    public abstract render(painter: IPainter): void;
}

export class MathObjectList extends MathObject {
    private _list: MathObject[] = [];

    public add(obj: MathObject): void {
        this._list.push(obj);
    } 

    public forEach(func: (obj: MathObject) => any): any {
        return this._list.forEach(func);
    }

    public performLayout(flow: VirtualFlow): void {
        this._list.forEach(obj => obj.performLayout(flow));
    }
    
    public render(painter: IPainter): void {
        this._list.forEach(obj => obj.render(painter));
    }
}
