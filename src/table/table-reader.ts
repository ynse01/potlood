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
import { TableBorderSet } from "./table-border-set.js";
import { TableMarginSet } from "./table-margin-set.js";

export class TableReader {
    public static readTable(docx: DocumentX, tableNode: ChildNode): Table {
        const table = new Table(docx);
        tableNode.childNodes.forEach(child => {
            switch(child.nodeName) {
                case "w:tr":
                    const row = this.readTableRow(child, table);
                    table.rows.push(row);
                    break;
                case "w:tblPr":
                    table.style = this.readTableStyle(child);
                    break;
                case "w:tblGrid":
                    let start = 0;
                    child.childNodes.forEach(col => {
                        if (col.nodeName === "w:gridCol") {
                            const w = Xml.getAttribute(col, "w:w");
                            if (w !== undefined) {
                                const width = Metrics.convertTwipsToPixels(parseInt(w));
                                table.columns.push(new TableColumn(start, width));
                                start += width;
                            }
                        }
                    });
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Table reading.`);
                    break;
            }
        });
        return table;
    }

    private static readTableRow(rowNode: ChildNode, table: Table): TableRow {
        const row = new TableRow(table);
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
        const style = new TableStyle();
        const cell = new TableCell(table.columns, style, colIndex);
        cellNode.childNodes.forEach(child => {
            switch(child.nodeName) {
                case "w:p":
                    const par = ParagraphReader.readParagraph(table.docx, child);
                    par.type = ParagraphType.TableCell;
                    cell.pars.push(par);
                    break;
                case "w:tcPr":
                    this.readTableCellPresentation(child, rowStyle, style);
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during TableCell reading.`);
                    break;
            }
        });
        const id = Xml.getAttribute(cellNode, "w:id");
        if (id !== undefined) {
            cell.id = id;
        }
        return cell;
    }

    private static readTableCellPresentation(cellPrNode: ChildNode, rowStyle: TableStyle, cellStyle: TableStyle): void {
        cellStyle.higherStyle = rowStyle;
        cellPrNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "w:tcW":
                    const w = Xml.getAttribute(child, "w:w");
                    if (w !== undefined) {
                        cellStyle.width = Metrics.convertTwipsToPixels(parseInt(w));
                    }
                    break;
                case "w:gridSpan":
                    const gridSpan = Xml.getStringValue(child);
                    if (gridSpan !== undefined) {
                        cellStyle.gridSpan = parseInt(gridSpan);
                    }
                    break;
                case "w:tcBorders":
                    cellStyle.borders = this.readBorders(child);
                    break;
                case "w:tcMar":
                    cellStyle.margins = this.readCellMargins(child);
                    break;
                case "w:shd":
                    const shading = Xml.getAttribute(child, "fill");
                    if (shading !== undefined) {
                        cellStyle.shading = shading;
                    }
                    break;
                case "w:vAlign":
                case "w:vMerge":
                    // TODO: Implement.
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Table Cell Style reading.`);
                    break;
            }
        });
    }

    private static readBorders(bordersNode: ChildNode): TableBorderSet {
        const borders = new TableBorderSet();
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
                default:
                    console.log(`Don't know how to parse ${node.nodeName} during Table Borders reading.`);
                    break;
            }
        });
        return borders;
    }

    private static readCellMargins(cellMarginNode: ChildNode): TableMarginSet {
        const margins = new TableMarginSet();
        cellMarginNode.childNodes.forEach(node => {
            const name = node.nodeName;
            switch (name) {
                case "w:left":
                    const left = Xml.getAttribute(node, "w:w");
                    if (left !== undefined) {
                        margins.cellMarginStart = Metrics.convertTwipsToPixels(parseInt(left));
                    }
                    break;
                case "w:start":
                    const start = Xml.getAttribute(node, "w:w");
                    if (start !== undefined) {
                        margins.cellMarginStart = Metrics.convertTwipsToPixels(parseInt(start));
                    }
                    break;
                case "w:right":
                    const right = Xml.getAttribute(node, "w:w");
                    if (right !== undefined) {
                        margins.cellMarginEnd = Metrics.convertTwipsToPixels(parseInt(right));
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
                default:
                    console.log(`Don't know how to parse ${node.nodeName} during Table Cell Margins reading.`);
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
            // Border size is in quarter points.
            border.size = Metrics.convertPointToPixels(parseInt(sz, 10) / 4);
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
        tblPrNode.childNodes.forEach(child => {
            switch (child.nodeName) {
                case "w:tblBorders":
                    style.borders = this.readBorders(child);
                    break;
                case "w:tblCellMar":
                    style.margins = this.readCellMargins(child);
                    break;
                case "w:jc":
                    const justification = Xml.getStringValue(child);
                    if (justification !== undefined) {
                        style.justification = Justification[justification as keyof typeof Justification];
                    }
                    break;
                case "w:tblInd":
                    const w = Xml.getAttribute(child, "w:w");
                    if (w !== undefined) {
                        style.identation = Metrics.convertTwipsToPixels(parseInt(w, 10));
                    }
                    break;
                case "w:cellSpacing":
                    const spacing = Xml.getAttribute(child, "w:w");
                    if (spacing !== undefined) {
                        style.cellSpacing = Metrics.convertTwipsToPixels(parseInt(spacing, 10));
                    }
                    break;
                case "w:tblW":
                case "w:tblStyle":
                case "w:tblLook":
                    // Ignore
                    break;
                default:
                    console.log(`Don't know how to parse ${child.nodeName} during Table Style reading.`);
                    break;
            }
        });
        return style;
    }
}