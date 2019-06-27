import { Xml } from "./xml.js";

export class TableColumn {
    public width: number;
    public start: number;

    constructor(start: number, width: number) {
        this.start = start;
        this.width = width;
    }
}

export class TableRow {
}

export class TableCell {
    public columns: TableColumn[];
    public rows: TableRow[];

    constructor(columns: TableColumn[], rows: TableRow[]) {
        this.columns = columns;
        this.rows = rows;
    }
}

export class Table {
    public columns: TableColumn[] = [];

    public static fromTableNode(tableNode: ChildNode): Table {
        const table = new Table();
        const grid = Xml.getFirstChildOfName(tableNode, "w:tblGrid");
        if (grid !== undefined) {
            let start = 0;
            Xml.getChildrenOfName(grid, "w:gridCol").forEach(col => {
                const w = (col as Element).getAttribute("w:w");
                if (w !== null) {
                    const width = parseInt(w);
                    table.columns.push(new TableColumn(start, width));
                    start += width;
                }
            });
        }
        return table;
    }
}