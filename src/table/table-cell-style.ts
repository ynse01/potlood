import { Borders } from "./borders.js";
import { Margins } from "./margins.js";

export class TableCellStyle {
    public width: number | undefined;
    public gridSpan: number = 1;
    public borders: Borders = new Borders();
    public margins: Margins = new Margins();
}