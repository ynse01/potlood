import { Xml } from "./xml.js";
import { Metrics } from "./metrics.js";
import { Paragraph, ParagraphType } from "./paragraph.js";
import { WordDocument } from "./word-document.js";
import { TableStyle, TableCellStyle } from "./table-style.js";

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

    public getMaxHeight(): number {
        let height = 0;
        this.cells.forEach(cell => {
            height = Math.max(height, cell.getHeight());
        });
        return height;
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
    public style: TableCellStyle;

    public static fromTableCellNode(cellNode: ChildNode, table: Table, colIndex: number): TableCell {
        const prNode = Xml.getFirstChildOfName(cellNode, "w:tcPr");
        let style;
        if (prNode !== undefined) {
            style = TableCellStyle.fromTableCellPresentationNode(prNode);
        } else {
            style = new TableCellStyle();
        }
        const cell = new TableCell(table.columns, style, colIndex);
        Xml.getChildrenOfName(cellNode, "w:p").forEach(pNode => {
            const par = new Paragraph(table.doc, pNode);
            par.type = ParagraphType.TableCell;
            cell.pars.push(par);
        });
        const id = (cellNode as Element).getAttribute("w:id");
        if (id !== null) {
            cell.id = id;
        }
        return cell;
    }

    constructor(columns: TableColumn[], style: TableCellStyle, startIndex: number) {
        this.style = style;
        this.columns = this.getColumns(columns, startIndex);
    }

    public getHeight(): number {
        const width = this.getWidth();
        let height = 0;
        this.pars.forEach(par => {
            height += par.getTextHeight(width);
        });
        return height;
    }

    public getStart(): number {
        return this.columns[0].start;
    }

    public getWidth(): number {
        let width = 0;
        this.columns.forEach(col => {
            width += col.width;
        });
        return width;
    }

    private getColumns(columns: TableColumn[], startIndex: number): TableColumn[] {
        const colSpan = this.style.gridSpan;
        return columns.slice(startIndex, startIndex + colSpan);
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

    public getHeight(): number {
        let height = 0;
        this.rows.forEach(row => {
            height += row.getMaxHeight();
        });
        return height;
    }
}