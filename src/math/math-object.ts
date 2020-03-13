import { VirtualFlow } from "../utils/virtual-flow.js";
import { IPainter } from "../painting/i-painter.js";
import { Size } from "../utils/math/size.js";

export abstract class MathObject {

    public abstract getSize(): Size;

    public abstract performLayout(flow: VirtualFlow): void;

    public abstract render(painter: IPainter): void;
}

export class MathObjectList extends MathObject {
    private _list: MathObject[] = [];

    public add(obj: MathObject): void {
        this._list.push(obj);
    } 

    public get(index: number): MathObject {
        return this._list[index];
    }

    public get length(): number {
        return this._list.length;
    }

    public forEach(func: (obj: MathObject) => any): any {
        return this._list.forEach(func);
    }

    public getSize(): Size {
        let size = new Size(0, 0);
        this._list.forEach(obj => {
            size = size.addHorizontal(obj.getSize());
        });
        return size;
    }

    public performLayout(flow: VirtualFlow): void {
        this._list.forEach(obj => obj.performLayout(flow));
    }
    
    public render(painter: IPainter): void {
        this._list.forEach(obj => obj.render(painter));
    }
}
