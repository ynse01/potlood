import { DocumentX } from "../document-x.js";
import { Table } from "./table.js";
import { Xml } from "../utils/xml.js";
import { Metrics } from "../utils/metrics.js";
import { TableColumn } from "./table-column.js";
import { TableRow } from "./table-row.js";
import { TableStyle } from "./table-style.js";
import { TableCell } from "./table-cell.js";
import { ParagraphType } from "../paragraph/paragraph.js";
import { TableBorder, TableBorderType } from "./table-border.js";
import { Justification } from "../paragraph/par-style.js";
import { ParagraphReader } from "../paragraph/paragraph-reader.js";
import { Borders } from "./borders.js";
import { Margins } from "./margins.js";

export class TableReader {
    public static readTable(docx: DocumentX, tableNode: ChildNode): Table {
        const table = new Table(docx);
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
        const prNode = Xml.getFirstChildOfName(tableNode, "w:tblPr");
        if (prNode !== undefined) {
            table.style = this.readTableStyle(prNode);
        }
        tableNode.childNodes.forEach(rowNode => {
            if (rowNode.nodeName === "w:tr") {
                const row = this.readTableRow(rowNode, table);
                table.rows.push(row);
            }
        });
        return table;
    }

    private static readTableRow(rowNode: ChildNode, table: Table): TableRow {
        const row = new TableRow();
        const rowStyle = new TableStyle();
        rowStyle.higherStyle = table.style;
        let colIndex = 0;
        rowNode.childNodes.forEach(cellNode => {
            if (cellNode.nodeName === "w:tc") {
                const cell = this.readTableCell(cellNode, table, rowStyle, colIndex);
                colIndex += cell.columns.length;
                row.cells.push(cell);
            }
        });
        return row;
    }

    private static readTableCell(cellNode: ChildNode, table: Table, rowStyle: TableStyle, colIndex: number): TableCell {
        const prNode = Xml.getFirstChildOfName(cellNode, "w:tcPr");
        let style;
        if (prNode !== undefined) {
            style = this.readTableCellPresentation(prNode, rowStyle);
        } else {
            style = new TableStyle();
        }
        const cell = new TableCell(table.columns, style, colIndex);
        cellNode.childNodes.forEach(pNode => {
            if (pNode.nodeName === "w:p") {
                const par = ParagraphReader.readParagraph(table.docx, pNode);
                par.type = ParagraphType.TableCell;
                cell.pars.push(par);
            }
        });
        const id = Xml.getAttribute(cellNode, "w:id");
        if (id !== undefined) {
            cell.id = id;
        }
        return cell;
    }

    private static readTableCellPresentation(cellPrNode: ChildNode, rowStyle: TableStyle): TableStyle {
        const style = new TableStyle();
        style.higherStyle = rowStyle;
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
            style.borders = this.readBorders(tcBorders);
        }
        const tcMargins = Xml.getFirstChildOfName(cellPrNode, "w:tcMar");
        if (tcMargins !== undefined) {
            style.margins = this.readCellMargins(tcMargins);
        }
        const tcShading = Xml.getFirstChildOfName(cellPrNode, "w:shd");
        if (tcShading !== undefined) {
            const shading = Xml.getAttribute(tcShading, "fill");
            if (shading !== undefined) {
                style.shading = shading;
            }
        }
        return style;
    }

    private static readBorders(bordersNode: ChildNode): Borders {
        const borders = new Borders();
        bordersNode.childNodes.forEach(node => {
            const name = node.nodeName;
            switch (name) {
                case "w:left":
                    if (borders.borderStart === undefined) {
                        borders.borderStart = this.readTableBorder(node);
                    }
                    break;
                case "w:start":
                    borders.borderStart = this.readTableBorder(node);
                    break;
                case "w:right":
                    if (borders.borderEnd === undefined) {
                        borders.borderEnd = this.readTableBorder(node);
                    }
                    break;
                case "w:end":
                    borders.borderEnd = this.readTableBorder(node);
                    break;
                case "w:top":
                    borders.borderTop = this.readTableBorder(node);
                    break;
                case "w:bottom":
                    borders.borderBottom = this.readTableBorder(node);
                    break;
                case "w:insideH":
                    borders.borderHorizontal = this.readTableBorder(node);
                    break;
                case "w:insideV":
                    borders.borderVertical = this.readTableBorder(node);
                    break;
            }
        });
        return borders;
    }

    private static readCellMargins(cellMarginNode: ChildNode): Margins {
        const margins = new Margins();
        cellMarginNode.childNodes.forEach(node => {
            const name = node.nodeName;
            switch (name) {
                case "w:left":
                    if (margins.cellMarginStart === undefined) {
                        const txt = Xml.getAttribute(node, "w:w");
                        if (txt !== undefined) {
                            margins.cellMarginStart = Metrics.convertTwipsToPixels(parseInt(txt));
                        }
                    }
                    break;
                case "w:start":
                    const start = Xml.getAttribute(node, "w:w");
                    if (start !== undefined) {
                        margins.cellMarginStart = Metrics.convertTwipsToPixels(parseInt(start));
                    }
                    break;
                case "w:right":
                    if (margins.cellMarginEnd === undefined) {
                        const txt = Xml.getAttribute(node, "w:w");
                        if (txt !== undefined) {
                            margins.cellMarginEnd = Metrics.convertTwipsToPixels(parseInt(txt));
                        }
                    }
                    break;
                case "w:end":
                    const end = Xml.getAttribute(node, "w:w");
                    if (end !== undefined) {
                        margins.cellMarginEnd = Metrics.convertTwipsToPixels(parseInt(end));
                    }
                    break;
                case "w:top":
                    const top = Xml.getAttribute(node, "w:w");
                    if (top !== undefined) {
                        margins.cellMarginTop = Metrics.convertTwipsToPixels(parseInt(top));
                    }
                    break;
                case "w:bottom":
                    const bottom = Xml.getAttribute(node, "w:w");
                    if (bottom !== undefined) {
                        margins.cellMarginBottom = Metrics.convertTwipsToPixels(parseInt(bottom));
                    }
                    break;
            }
        });
        return margins;
    }

    private static readTableBorder(borderNode: ChildNode): TableBorder {
        // TODO: Handle frame, shadow
        const border = new TableBorder();
        const val = Xml.getAttribute(borderNode, "w:val");
        if (val !== undefined) {
            border.type = TableBorderType[val as keyof typeof TableBorderType];
        }
        const sz = Xml.getAttribute(borderNode, "w:sz");
        if (sz !== undefined) {
            // Border size is in eights of a point.
            border.size = Metrics.convertPointToPixels(parseInt(sz, 10) / 8);
        }
        const space = Xml.getAttribute(borderNode, "w:space");
        if (space !== undefined) {
            border.spacing = Metrics.convertTwipsToPixels(parseInt(space, 10));
        }
        const color = Xml.getAttribute(borderNode, "w:color");
        if (color !== undefined) {
            border.color = color;
        }
        return border;
    }

    private static readTableStyle(tblPrNode: ChildNode): TableStyle {
        const style = new TableStyle();
        const tableBorders = Xml.getFirstChildOfName(tblPrNode, "w:tblBorders");
        if (tableBorders !== undefined) {
            style.borders = this.readBorders(tableBorders);
        }
        const cellMargins = Xml.getFirstChildOfName(tblPrNode, "w:tblCellMar");
        if (cellMargins !== undefined) {
            style.margins = this.readCellMargins(cellMargins);
        }
        const justification = Xml.getStringValueFromNode(tblPrNode, "w:jc");
        if (justification !== undefined) {
            style.justification = Justification[justification as keyof typeof Justification];
        }
        const identation = Xml.getFirstChildOfName(tblPrNode, "w:tblInd");
        if (identation !== undefined) {
            const w = Xml.getAttribute(identation, "w:w");
            if (w !== undefined) {
                style.identation = Metrics.convertTwipsToPixels(parseInt(w, 10));
            }
        }
        const cellSpacing = Xml.getFirstChildOfName(tblPrNode, "w:tblCellSpacing");
        if (cellSpacing !== undefined) {
            const spacing = Xml.getAttribute(cellSpacing, "w:w");
            if (spacing !== undefined) {
                style.cellSpacing = Metrics.convertTwipsToPixels(parseInt(spacing, 10));
            }
        }
        return style;
    }
}