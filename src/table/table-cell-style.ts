import { BordersAndMargins } from "./borders-and-margins.js";

export class TableCellStyle {
    public width: number | undefined;
    public gridSpan: number = 1;
    public borders: BordersAndMargins = new BordersAndMargins();
}