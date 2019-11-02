import { Paragraph } from "../paragraph/paragraph.js";
import { TableCell } from "./table-cell.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
export declare class TableRow {
    cells: TableCell[];
    getMaxHeight(): number;
    getPars(): Paragraph[];
    performLayout(flow: VirtualFlow): void;
}
