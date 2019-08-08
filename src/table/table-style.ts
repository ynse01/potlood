import { Xml } from "../utils/xml.js";
import { Justification } from "../paragraph/par-style.js";
import { BordersAndMargins } from "./borders-and-margins.js";

export class TableStyle {
    public width: number | undefined;
    public justification: Justification | undefined;
    public identation: number | undefined;
    public borders: BordersAndMargins = new BordersAndMargins();
    
    public static fromTablePresentationNode(tblPrNode: ChildNode): TableStyle {
        const style = new TableStyle();
        const borders = Xml.getFirstChildOfName(tblPrNode, "w:tblBorders");
        if (borders !== undefined) {
            BordersAndMargins.readBorders(borders, style.borders);
        }
        const cellMargins = Xml.getFirstChildOfName(tblPrNode, "w:tblCellMar");
        if (cellMargins !== undefined) {
            BordersAndMargins.readCellMargins(cellMargins, style.borders);
        }
        const justification = Xml.getStringValueFromNode(tblPrNode, "w:jc");
        if (justification !== undefined) {
            style.justification = Justification[justification as keyof typeof Justification];
        }
        const identation = Xml.getFirstChildOfName(tblPrNode, "w:tblInd");
        if (identation !== undefined) {
            const w = Xml.getAttribute(identation, "w:w");
            if (w !== undefined) {
                style.identation = parseInt(w);
            }
        }
        return style;
    }
}
