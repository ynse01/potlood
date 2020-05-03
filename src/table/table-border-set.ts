import { TableBorder } from "./table-border";

export class TableBorderSet {
    public borderTop: TableBorder | undefined;
    public borderStart: TableBorder | undefined;
    public borderBottom: TableBorder | undefined;
    public borderEnd: TableBorder | undefined;
    public borderHorizontal: TableBorder | undefined;
    public borderVertical: TableBorder | undefined;

    constructor() {
        this.borderTop = new TableBorder();
        this.borderBottom = new TableBorder();
        this.borderStart = new TableBorder();
        this.borderEnd = new TableBorder();
    }
}