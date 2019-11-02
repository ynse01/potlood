import { Table } from "./table.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { IPainter } from "../painting/i-painter.js";
import { ParagraphRenderer } from "../paragraph/paragraph-renderer.js";
export declare class TableRenderer {
    private _parRenderer;
    private _painter;
    constructor(painter: IPainter, paragraphRenderer: ParagraphRenderer);
    renderTable(table: Table, flow: VirtualFlow): void;
    private renderCellShading;
    private renderCellBorder;
}
