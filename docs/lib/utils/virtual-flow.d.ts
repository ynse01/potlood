import { Section } from "../section.js";
import { TableCell } from "../table/table-cell.js";
import { Table } from "../table/table.js";
export declare class VirtualFlow {
    private _xMin;
    private _xMax;
    private _pos;
    static fromSection(section: Section | undefined): VirtualFlow;
    constructor(xMin: number, xMax: number, position?: number);
    getX(): number;
    getY(): number;
    getWidth(): number;
    advancePosition(delta: number): VirtualFlow;
    createCellFlow(cell: TableCell, table: Table): VirtualFlow;
    clone(): VirtualFlow;
}
