import { Xml } from "./xml.js";
import { Metrics } from "./metrics.js";
import { Justification } from "./par-style.js";

export enum TableBorderType {
    none = "none",
    single = "single",
    dashDotStroked = "dashDotStroked",
    dashed = "dashed",
    dashSmallGap = "dashSmallGap",
    dotDash = "dotDash",
    dotDotDash = "dotDotDash",
    dotted = "dotted",
    double = "double",
    doubleWave = "doubleWave",
    inset = "inset",
    nil = "nil",
    outset = "outset",
    thick = "thick",
    thickThinLargeGap = "thickThinLargeGap",
    thickThinMediumGap = "thickThinMediumGap",
    thickThinSmallGap = "thickThinSmallGap",
    thinThickLargeGap = "thinThickLargeGap",
    thinThickMediumGap = "thinThickMediumGap",
    thinThickSmallGap = "thinThickSmallGap",
    thinThickThinLargeGap = "thinThickThinLargeGap",
    thinThickThinMediumGap = "thinThickThinMediumGap",
    thinThickThinSmallGap = "thinThickThinSmallGap",
    threeDEmboss = "threeDEmboss",
    threeDEngrave = "threeDEngrave",
    triple = "triple",
    wave = "wave"
}

export class TableBorder {
    public type: TableBorderType;
    public size: number;
    public spacing: number;
    public color: string;

    public static fromBorderNode(borderNode: ChildNode): TableBorder {
        const border = new TableBorder();
        const element = borderNode as Element;
        const val = element.getAttribute("w:val");
        if (val !== null) {
            border.type = TableBorderType[val as keyof typeof TableBorderType];
        }
        const sz = element.getAttribute("w:sz");
        if (sz !== null) {
            border.size = parseInt(sz, 10);
        }
        const space = element.getAttribute("w:space");
        if (space !== null) {
            border.spacing = parseInt(space, 10);
        }
        const color = element.getAttribute("w:color");
        if (color !== null) {
            border.color = color;
        }
        return border;
    }

    constructor() {
        this.type = TableBorderType.none;
        this.size = 0;
        this.spacing = 0;
        this.color = "000000";
    }
}

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
            const w = (identation as Element).getAttribute("w:w");
            if (w !== null) {
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
            const element = node as Element;
            switch (name) {
                case "w:left":
                    if (style.cellMarginStart === undefined) {
                        const txt = element.getAttribute("w:w");
                        if (txt !== null) {
                            style.cellMarginStart = Metrics.convertTwipsToPixels(parseInt(txt));
                        }
                    }
                    break;
                case "w:start":
                    const start = element.getAttribute("w:w");
                    if (start !== null) {
                        style.cellMarginStart = Metrics.convertTwipsToPixels(parseInt(start));
                    }
                    break;
                case "w:right":
                    if (style.cellMarginEnd === undefined) {
                        const txt = element.getAttribute("w:w");
                        if (txt !== null) {
                            style.cellMarginEnd = Metrics.convertTwipsToPixels(parseInt(txt));
                        }
                    }
                    break;
                case "w:end":
                    const end = element.getAttribute("w:w");
                    if (end !== null) {
                        style.cellMarginEnd = Metrics.convertTwipsToPixels(parseInt(end));
                    }
                    break;
                case "w:top":
                    const top = element.getAttribute("w:w");
                    if (top !== null) {
                        style.cellMarginTop = Metrics.convertTwipsToPixels(parseInt(top));
                    }
                    break;
                case "w:bottom":
                    const bottom = element.getAttribute("w:w");
                    if (bottom !== null) {
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

export class TableCellStyle {
    public width: number | undefined;
    public gridSpan: number = 1;

    public static fromTableCellPresentationNode(cellPrNode: ChildNode): TableCellStyle {
        const style = new TableCellStyle();
        const tcW = Xml.getFirstChildOfName(cellPrNode, "w:tcW");
        if (tcW !== undefined) {
            const w = (tcW as Element).getAttribute("w:w");
            if (w !== null) {
                style.width = Metrics.convertTwipsToPixels(parseInt(w));
            }
        }
        const gridSpan = Xml.getStringValueFromNode(cellPrNode, "w:gridSpan");
        if (gridSpan !== undefined) {
            style.gridSpan = parseInt(gridSpan);
        }
        return style;
    }
}