import { Xml } from "./xml.js";
import { Metrics } from "./metrics.js";
import { Paragraph } from "./paragraph.js";
import { WordDocument } from "./word-document.js";

export class TableColumn {
    public width: number;
    public start: number;

    constructor(start: number, width: number) {
        this.start = start;
        this.width = width;
    }
}

export class TableRow {
    public cells: TableCell[] = [];

    public static fromTableRowNode(rowNode: ChildNode, table: Table): TableRow {
        const row = new TableRow();
        let colIndex = 0;
        Xml.getChildrenOfName(rowNode, "w:tc").forEach(cellNode => {
            const cell = TableCell.fromTableCellNode(cellNode, table, colIndex);
            colIndex += cell.columns.length;
            row.cells.push(cell);
        });
        return row;
    }
}

export class TableCell {
    public id: string | undefined = undefined;
    public columns: TableColumn[];
    public rowSpan: number = 1;
    public par: Paragraph;

    public static fromTableCellNode(cellNode: ChildNode, table: Table, colIndex: number): TableCell {
        const pNode = Xml.getFirstChildOfName(cellNode, "w:p");
        let par: Paragraph;
        if (pNode !== undefined) {
            par = new Paragraph(table.doc, pNode);
        } else {
            par = Paragraph.createEmpty(table.doc);
        }
        const columns: TableColumn[] = [table.columns[colIndex]];
        const cell = new TableCell(columns, par);
        const id = (cellNode as Element).getAttribute("w:id");
        if (id !== null) {
            cell.id = id;
        }
        return cell;
    }

    constructor(columns: TableColumn[], par: Paragraph) {
        this.columns = columns;
        this.par = par;
    }
}

export class Table {
    public columns: TableColumn[];
    public rows: TableRow[];
    public doc: WordDocument;

    public static fromTableNode(doc: WordDocument, tableNode: ChildNode): Table {
        const table = new Table(doc);
        const grid = Xml.getFirstChildOfName(tableNode, "w:tblGrid");
        if (grid !== undefined) {
            let start = 0;
            Xml.getChildrenOfName(grid, "w:gridCol").forEach(col => {
                const w = (col as Element).getAttribute("w:w");
                if (w !== null) {
                    const width = Metrics.convertTwipsToPixels(parseInt(w));
                    table.columns.push(new TableColumn(start, width));
                    start += width;
                }
            });
        }
        Xml.getChildrenOfName(tableNode, "w:tr").forEach(rowNode => {
            const row = TableRow.fromTableRowNode(rowNode, table);
            table.rows.push(row);
        });
        return table;
    }

    constructor(doc: WordDocument) {
        this.doc = doc;
        this.columns = [];
        this.rows = [];
    }
}