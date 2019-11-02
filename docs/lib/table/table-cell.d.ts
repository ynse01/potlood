import { TableColumn } from "./table-column.js";
import { Paragraph } from "../paragraph/paragraph.js";
import { TableStyle } from "./table-style.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
export declare class TableCell {
    id: string | undefined;
    columns: TableColumn[];
    rowSpan: number;
    pars: Paragraph[];
    style: TableStyle;
    constructor(columns: TableColumn[], style: TableStyle, startIndex: number);
    getHeight(): number;
    getStart(): number;
    getWidth(): number;
    getTextWidth(): number;
    private getColumns;
    performLayout(flow: VirtualFlow): void;
}
