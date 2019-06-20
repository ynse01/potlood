export class FlowPosition {
    public flowPosition: number;

    constructor(initialPosition: number) {
        this.flowPosition = initialPosition;
    }

    public add(delta: number): FlowPosition {
        this.flowPosition += delta;
        return this;
    }

    public subtract(delta: number): FlowPosition {
        this.flowPosition -= delta;
        return this;
    }

    public set(pos: FlowPosition): FlowPosition {
        this.flowPosition = pos.flowPosition;
        return this;
    }

    public clone(): FlowPosition {
        return new FlowPosition(this.flowPosition);
    }
}