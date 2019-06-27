import { Xml } from "./xml.js";
import { Metrics } from "./metrics.js";
import { Paragraph } from "./paragraph.js";
import { WordDocument } from "./word-document.js";
import { TableStyle } from "./table-style.js";

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

    public getPars(): Paragraph[] {
        const pars: Paragraph[] = [];
        this.cells.forEach(cell => {
            pars.push(...cell.pars);
        });
        return pars;
    }
}
export class TableCell {
    public id: string | undefined = undefined;
    public columns: TableColumn[];
    public rowSpan: number = 1;
    public pars: Paragraph[] = [];

    public static fromTableCellNode(cellNode: ChildNode, table: Table, colIndex: number): TableCell {
        const columns: TableColumn[] = [table.columns[colIndex]];
        const cell = new TableCell(columns);
        Xml.getChildrenOfName(cellNode, "w:p").forEach(pNode => {
            cell.pars.push(new Paragraph(table.doc, pNode));
        });
        const id = (cellNode as Element).getAttribute("w:id");
        if (id !== null) {
            cell.id = id;
        }
        return cell;
    }

    constructor(columns: TableColumn[]) {
        this.columns = columns;
    }
}

export class Table {
    public columns: TableColumn[];
    public rows: TableRow[];
    public doc: WordDocument;
    public style: TableStyle;

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
        const prNode = Xml.getFirstChildOfName(tableNode, "w:tblPr");
        if (prNode !== undefined) {
            table.style = TableStyle.fromTablePresentationNode(prNode);
        }
        return table;
    }

    constructor(doc: WordDocument) {
        this.doc = doc;
        this.columns = [];
        this.rows = [];
        this.style = new TableStyle();
    }

    public getPars(): Paragraph[] {
        const pars: Paragraph[] = [];
        this.rows.forEach(row => {
            pars.push(...row.getPars());
        });
        return pars;
    }
}