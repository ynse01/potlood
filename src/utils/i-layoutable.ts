import { VirtualFlow } from "./virtual-flow";

/**
 * Interface for objects that can be layed out on the screen.
 */
export interface ILayoutable {
    /**
     * Perform the layout operation.
     * @param flow The flow position.
     */
    performLayout(flow: VirtualFlow): void;
}