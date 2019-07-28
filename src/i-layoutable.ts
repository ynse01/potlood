import { FlowPosition } from "./flow-position.js";
import { VirtualFlow } from "./virtual-flow.js";

export interface ILayoutable {
    performLayout(flow: VirtualFlow, pos: FlowPosition): void;
}