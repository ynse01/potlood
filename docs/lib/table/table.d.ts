import { Paragraph } from "../paragraph/paragraph.js";
import { DocumentX } from "../document-x.js";
import { TableStyle } from "./table-style.js";
import { TableColumn } from "./table-column.js";
import { TableRow } from "./table-row.js";
import { ILayoutable } from "../utils/i-layoutable.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
export declare class Table implements ILayoutable {
    columns: TableColumn[];
    rows: TableRow[];
    docx: DocumentX;
    style: TableStyle;
    constructor(docx: DocumentX);
    getPars(): Paragraph[];
    getHeight(): number;
    performLayout(flow: VirtualFlow): void;
}
