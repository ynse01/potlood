import { TableBorder } from "./table-border.js";
import { Metrics } from "../utils/metrics.js";
import { Xml } from "../utils/xml.js";

export class BordersAndMargins {
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

    public static readBorders(bordersNode: ChildNode, bordersAndMargins: BordersAndMargins): void {
        bordersNode.childNodes.forEach(node => {
            const name = node.nodeName;
            switch (name) {
                case "w:left":
                    if (bordersAndMargins.borderStart === undefined) {
                        bordersAndMargins.borderStart = TableBorder.fromBorderNode(node);
                    }
                    break;
                case "w:start":
                    bordersAndMargins.borderStart = TableBorder.fromBorderNode(node);
                    break;
                case "w:right":
                    if (bordersAndMargins.borderEnd === undefined) {
                        bordersAndMargins.borderEnd = TableBorder.fromBorderNode(node);
                    }
                    break;
                case "w:end":
                    bordersAndMargins.borderEnd = TableBorder.fromBorderNode(node);
                    break;
                case "w:top":
                    bordersAndMargins.borderTop = TableBorder.fromBorderNode(node);
                    break;
                case "w:bottom":
                    bordersAndMargins.borderBottom = TableBorder.fromBorderNode(node);
                    break;
                case "w:insideH":
                    bordersAndMargins.borderHorizontal = TableBorder.fromBorderNode(node);
                    break;
                case "w:insideV":
                    bordersAndMargins.borderVertical = TableBorder.fromBorderNode(node);
                    break;
            }
        });
    }

    public static readCellMargins(cellMarginNode: ChildNode, bordersAndMargins: BordersAndMargins): void {
        cellMarginNode.childNodes.forEach(node => {
            const name = node.nodeName;
            switch (name) {
                case "w:left":
                    if (bordersAndMargins.cellMarginStart === undefined) {
                        const txt = Xml.getAttribute(node, "w:w");
                        if (txt !== undefined) {
                            bordersAndMargins.cellMarginStart = Metrics.convertTwipsToPixels(parseInt(txt));
                        }
                    }
                    break;
                case "w:start":
                    const start = Xml.getAttribute(node, "w:w");
                    if (start !== undefined) {
                        bordersAndMargins.cellMarginStart = Metrics.convertTwipsToPixels(parseInt(start));
                    }
                    break;
                case "w:right":
                    if (bordersAndMargins.cellMarginEnd === undefined) {
                        const txt = Xml.getAttribute(node, "w:w");
                        if (txt !== undefined) {
                            bordersAndMargins.cellMarginEnd = Metrics.convertTwipsToPixels(parseInt(txt));
                        }
                    }
                    break;
                case "w:end":
                    const end = Xml.getAttribute(node, "w:w");
                    if (end !== undefined) {
                        bordersAndMargins.cellMarginEnd = Metrics.convertTwipsToPixels(parseInt(end));
                    }
                    break;
                case "w:top":
                    const top = Xml.getAttribute(node, "w:w");
                    if (top !== undefined) {
                        bordersAndMargins.cellMarginTop = Metrics.convertTwipsToPixels(parseInt(top));
                    }
                    break;
                case "w:bottom":
                    const bottom = Xml.getAttribute(node, "w:w");
                    if (bottom !== undefined) {
                        bordersAndMargins.cellMarginBottom = Metrics.convertTwipsToPixels(parseInt(bottom));
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