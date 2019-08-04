import { Metrics } from "../utils/metrics.js";
import { Xml } from "../utils/xml.js";
import { BordersAndMargins } from "./borders-and-margins.js";

export class TableCellStyle {
    public width: number | undefined;
    public gridSpan: number = 1;
    public borders: BordersAndMargins = new BordersAndMargins();

    public static fromTableCellPresentationNode(cellPrNode: ChildNode): TableCellStyle {
        const style = new TableCellStyle();
        const tcW = Xml.getFirstChildOfName(cellPrNode, "w:tcW");
        if (tcW !== undefined) {
            const w = Xml.getAttribute(tcW, "w:w");
            if (w !== undefined) {
                style.width = Metrics.convertTwipsToPixels(parseInt(w));
            }
        }
        const gridSpan = Xml.getStringValueFromNode(cellPrNode, "w:gridSpan");
        if (gridSpan !== undefined) {
            style.gridSpan = parseInt(gridSpan);
        }
        const tcBorders = Xml.getFirstChildOfName(cellPrNode, "w:tcBorders");
        if (tcBorders !== undefined) {
            BordersAndMargins.readBorders(tcBorders, style.borders);
        }
        const tcMargins = Xml.getFirstChildOfName(cellPrNode, "w:tcMar");
        if (tcMargins !== undefined) {
            BordersAndMargins.readCellMargins(tcMargins, style.borders);
        }
        return style;
    }
}