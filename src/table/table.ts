import { Paragraph } from "../paragraph/paragraph.js";
import { DocumentX } from "../document-x.js";
import { TableStyle } from "./table-style.js";
import { TableColumn } from "./table-column.js";
import { TableRow } from "./table-row.js";
import { ILayoutable } from "../utils/i-layoutable.js";
import { VirtualFlow } from "../utils/virtual-flow.js";

export class Table implements ILayoutable {
    public columns: TableColumn[];
    public rows: TableRow[];
    public docx: DocumentX;
    public style: TableStyle;

    constructor(docx: DocumentX) {
        this.docx = docx;
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
            height += row.maxHeight || 0;
        });
        return height;
    }

    public performLayout(flow: VirtualFlow): void {
        this.rows.forEach(row => {
            row.performLayout(flow);
        })
    }

}