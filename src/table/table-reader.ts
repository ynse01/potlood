import { WordDocument } from "../word-document.js";
import { Table } from "./table.js";
import { Xml } from "../utils/xml.js";
import { Metrics } from "../utils/metrics.js";
import { TableColumn } from "./table-column.js";
import { TableRow } from "./table-row.js";
import { TableStyle } from "./table-style.js";
import { TableCell } from "./table-cell.js";
import { TableCellStyle } from "./table-cell-style.js";
import { ParagraphType } from "../paragraph/paragraph.js";
import { BordersAndMargins } from "./borders-and-margins.js";
import { TableBorder, TableBorderType } from "./table-border.js";
import { Justification } from "../paragraph/par-style.js";
import { ParagraphReader } from "../paragraph/paragraph-reader.js";

export class TableReader {
    public static readTable(doc: WordDocument, tableNode: ChildNode): Table {
        const table = new Table(doc);
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
        tableNode.childNodes.forEach(rowNode => {
            if (rowNode.nodeName === "w:tr") {
                const row = this.readTableRow(rowNode, table);
                table.rows.push(row);
            }
        });
        const prNode = Xml.getFirstChildOfName(tableNode, "w:tblPr");
        if (prNode !== undefined) {
            table.style = this.readTableStyle(prNode);
        }
        return table;
    }

    private static readTableRow(rowNode: ChildNode, table: Table): TableRow {
        const row = new TableRow();
        let colIndex = 0;
        rowNode.childNodes.forEach(cellNode => {
            if (cellNode.nodeName === "w:tc") {
                const cell = this.readTableCell(cellNode, table, colIndex);
                colIndex += cell.columns.length;
                row.cells.push(cell);
            }
        });
        return row;
    }

    private static readTableCell(cellNode: ChildNode, table: Table, colIndex: number): TableCell {
        const prNode = Xml.getFirstChildOfName(cellNode, "w:tcPr");
        let style;
        if (prNode !== undefined) {
            style = this.readTableCellPresentation(prNode);
        } else {
            style = new TableCellStyle();
        }
        const cell = new TableCell(table.columns, table.style, style, colIndex);
        cellNode.childNodes.forEach(pNode => {
            if (pNode.nodeName === "w:p") {
                const par = ParagraphReader.readParagraph(table.doc, pNode);
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

    private static readTableCellPresentation(cellPrNode: ChildNode): TableCellStyle {
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
            this.readBorders(tcBorders, style.borders);
        }
        const tcMargins = Xml.getFirstChildOfName(cellPrNode, "w:tcMar");
        if (tcMargins !== undefined) {
            this.readCellMargins(tcMargins, style.borders);
        }
        return style;
    }

    private static readBorders(bordersNode: ChildNode, bordersAndMargins: BordersAndMargins): void {
        bordersNode.childNodes.forEach(node => {
            const name = node.nodeName;
            switch (name) {
                case "w:left":
                    if (bordersAndMargins.borderStart === undefined) {
                        bordersAndMargins.borderStart = this.readTableBorder(node);
                    }
                    break;
                case "w:start":
                    bordersAndMargins.borderStart = this.readTableBorder(node);
                    break;
                case "w:right":
                    if (bordersAndMargins.borderEnd === undefined) {
                        bordersAndMargins.borderEnd = this.readTableBorder(node);
                    }
                    break;
                case "w:end":
                    bordersAndMargins.borderEnd = this.readTableBorder(node);
                    break;
                case "w:top":
                    bordersAndMargins.borderTop = this.readTableBorder(node);
                    break;
                case "w:bottom":
                    bordersAndMargins.borderBottom = this.readTableBorder(node);
                    break;
                case "w:insideH":
                    bordersAndMargins.borderHorizontal = this.readTableBorder(node);
                    break;
                case "w:insideV":
                    bordersAndMargins.borderVertical = this.readTableBorder(node);
                    break;
            }
        });
    }

    private static readCellMargins(cellMarginNode: ChildNode, bordersAndMargins: BordersAndMargins): void {
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

    private static readTableBorder(borderNode: ChildNode): TableBorder {
        const border = new TableBorder();
        const val = Xml.getAttribute(borderNode, "w:val");
        if (val !== undefined) {
            border.type = TableBorderType[val as keyof typeof TableBorderType];
        }
        const sz = Xml.getAttribute(borderNode, "w:sz");
        if (sz !== undefined) {
            // Borders are in eights of a point.
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
        const borders = Xml.getFirstChildOfName(tblPrNode, "w:tblBorders");
        if (borders !== undefined) {
            this.readBorders(borders, style.borders);
        }
        const cellMargins = Xml.getFirstChildOfName(tblPrNode, "w:tblCellMar");
        if (cellMargins !== undefined) {
            this.readCellMargins(cellMargins, style.borders);
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