import { Xml } from "../utils/xml.js";
import { Metrics } from "../utils/metrics.js";
import { Paragraph } from "../paragraph.js";
import { WordDocument } from "../word-document.js";
import { TableStyle } from "./table-style.js";
import { TableColumn } from "./table-column.js";
import { TableRow } from "./table-row.js";
import { ILayoutable } from "../i-layoutable.js";
import { VirtualFlow } from "../virtual-flow.js";

export class Table implements ILayoutable {
    public columns: TableColumn[];
    public rows: TableRow[];
    public doc: WordDocument;
    public style: TableStyle;

    public static fromTableNode(doc: WordDocument, tableNode: ChildNode): Table {
        const table = new Table(doc);
        const grid = Xml.getFirstChildOfName(tableNode, "w:tblGrid");
        if (grid !== undefined) {
            let start = 0;
            grid.childNodes.forEach(col => {
                if (col.nodeName === "w:gridCol") {
                    const w = Xml.getAttribute(col, "w:w");
                    if (w !== undefined) {
                        const width = Metrics.convertTwipsToPixels(parseInt(w));
                        table.columns.push(new TableColumn(start, width));
                        start += width;
                    }
                }
            });
        }
        tableNode.childNodes.forEach(rowNode => {
            if (rowNode.nodeName === "w:tr") {
                const row = TableRow.fromTableRowNode(rowNode, table);
                table.rows.push(row);
            }
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

    public performLayout(flow: VirtualFlow): void {
        this.rows.forEach(row => {
            row.performLayout(flow);
        })
    }

}