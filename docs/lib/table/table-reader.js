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
    static readTable(docx, tableNode) {
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
    static readTableRow(rowNode, table) {
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
    static readTableCell(cellNode, table, rowStyle, colIndex) {
        const prNode = Xml.getFirstChildOfName(cellNode, "w:tcPr");
        let style;
        if (prNode !== undefined) {
            style = this.readTableCellPresentation(prNode, rowStyle);
        }
        else {
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
    static readTableCellPresentation(cellPrNode, rowStyle) {
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
    static readBorders(bordersNode) {
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
            }
        });
        return borders;
    }
    static readCellMargins(cellMarginNode) {
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
            }
        });
        return margins;
    }
    static readTableBorder(borderNode) {
        // TODO: Handle frame, shadow
        const border = new TableBorder();
        const val = Xml.getAttribute(borderNode, "w:val");
        if (val !== undefined) {
            border.type = TableBorderType[val];
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
    static readTableStyle(tblPrNode) {
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
            style.justification = Justification[justification];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtcmVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3RhYmxlL3RhYmxlLXJlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN0QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzVDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ2pFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDbkUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUV2RCxNQUFNLE9BQU8sV0FBVztJQUNiLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBZSxFQUFFLFNBQW9CO1FBQ3pELE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlCLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDN0QsSUFBSSxJQUFJLEtBQUssU0FBUyxF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