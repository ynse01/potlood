import { DocumentX } from "../document-x.js";
import { Table } from "./table.js";
export declare class TableReader {
    static readTable(docx: DocumentX, tableNode: ChildNode): Table;
    private static readTableRow;
    private static readTableCell;
    private static readTableCellPresentation;
    private static readBorders;
    private static readCellMargins;
    private static readTableBorder;
    private static readTableStyle;
}
