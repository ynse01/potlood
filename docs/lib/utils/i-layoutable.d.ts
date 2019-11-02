import { VirtualFlow } from "./virtual-flow.js";
export interface ILayoutable {
    performLayout(flow: VirtualFlow): void;
}
