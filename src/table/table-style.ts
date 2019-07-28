import { Xml } from "../utils/xml.js";
import { Metrics } from "../metrics.js";
import { Justification } from "../text/par-style.js";
import { TableBorder } from "./table-border.js";

export class TableStyle {
    public width: number | undefined;
    public justification: Justification | undefined;
    public identation: number | undefined;
    public borderTop: TableBorder | undefined;
    public borderStart: TableBorder | undefined;
    public borderBottom: TableBorder | undefined;
    public borderEnd: TableBorder | undefined;
    public borderHorizontal: TableBorder | undefined;
    public borderVertical: TableBorder | undefined;
    public cellMarginTop: number;
    public cellMarginStart: number;
    public cellMarginBottom: number;
    public cellMarginEnd: number;

    public static fromTablePresentationNode(tblPrNode: ChildNode): TableStyle {
        const style = new TableStyle();
        const borders = Xml.getFirstChildOfName(tblPrNode, "w:tblBorders");
        if (borders !== undefined) {
            TableStyle.readBorders(borders, style);
        }
        const cellMargins = Xml.getFirstChildOfName(tblPrNode, "w:tblCellMar");
        if (cellMargins !== undefined) {
            TableStyle.readCellMargins(cellMargins, style);
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

    private static readBorders(bordersNode: ChildNode, style: TableStyle): void {
        bordersNode.childNodes.forEach(node => {
            const name = node.nodeName;
            switch (name) {
                case "w:left":
                    if (style.borderStart === undefined) {
                        style.borderStart = TableBorder.fromBorderNode(node);
                    }
                    break;
                case "w:start":
                    style.borderStart = TableBorder.fromBorderNode(node);
                    break;
                case "w:right":
                    if (style.borderEnd === undefined) {
                        style.borderEnd = TableBorder.fromBorderNode(node);
                    }
                    break;
                case "w:end":
                    style.borderEnd = TableBorder.fromBorderNode(node);
                    break;
                case "w:top":
                    style.borderTop = TableBorder.fromBorderNode(node);
                    break;
                case "w:bottom":
                    style.borderBottom = TableBorder.fromBorderNode(node);
                    break;
                case "w:insideH":
                    style.borderHorizontal = TableBorder.fromBorderNode(node);
                    break;
                case "w:insideV":
                    style.borderVertical = TableBorder.fromBorderNode(node);
                    break;
            }
        });
    }

    private static readCellMargins(cellMarginNode: ChildNode, style: TableStyle): void {
        cellMarginNode.childNodes.forEach(node => {
            const name = node.nodeName;
            switch (name) {
                case "w:left":
                    if (style.cellMarginStart === undefined) {
                        const txt = Xml.getAttribute(node, "w:w");
                        if (txt !== undefined) {
                            style.cellMarginStart = Metrics.convertTwipsToPixels(parseInt(txt));
                        }
                    }
                    break;
                case "w:start":
                    const start = Xml.getAttribute(node, "w:w");
                    if (start !== undefined) {
                        style.cellMarginStart = Metrics.convertTwipsToPixels(parseInt(start));
                    }
                    break;
                case "w:right":
                    if (style.cellMarginEnd === undefined) {
                        const txt = Xml.getAttribute(node, "w:w");
                        if (txt !== undefined) {
                            style.cellMarginEnd = Metrics.convertTwipsToPixels(parseInt(txt));
                        }
                    }
                    break;
                case "w:end":
                    const end = Xml.getAttribute(node, "w:w");
                    if (end !== undefined) {
                        style.cellMarginEnd = Metrics.convertTwipsToPixels(parseInt(end));
                    }
                    break;
                case "w:top":
                    const top = Xml.getAttribute(node, "w:w");
                    if (top !== undefined) {
                        style.cellMarginTop = Metrics.convertTwipsToPixels(parseInt(top));
                    }
                    break;
                case "w:bottom":
                    const bottom = Xml.getAttribute(node, "w:w");
                    if (bottom !== undefined) {
                        style.cellMarginBottom = Metrics.convertTwipsToPixels(parseInt(bottom));
                    }
                    break;
            }
        });
    }

    constructor() {
        const defaultMargin = Metrics.convertTwipsToPixels(115);
        this.cellMarginBottom = 0;
        this.cellMarginTop = 0;
        this.cellMarginStart = defaultMargin;
        this.cellMarginEnd = defaultMargin;
    }
}
