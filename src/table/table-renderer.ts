import { Table } from "./table.js";
import { TableCell } from "./table-cell.js";
import { TableStyle } from "./table-style.js";
import { IPainter, DashMode } from "../painting/i-painter.js";
import { ParagraphRenderer } from "../paragraph/paragraph-renderer.js";
import { TableBorderSet } from "./table-border-set.js";
import { TableBorderType, TableBorder } from "./table-border.js";

interface IColoredLine {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: string;
}

interface ISubLine {
    pos: number;
    width: number;
    dashing: DashMode;
}

export class TableRenderer {
    private _parRenderer: ParagraphRenderer;
    private _painter: IPainter;

    constructor(painter: IPainter, paragraphRenderer: ParagraphRenderer) {
        this._painter = painter;
        this._parRenderer = paragraphRenderer;
    }

    public renderTable(table: Table): void {
        table.rows.forEach(row => {
            row.cells.forEach(cell => {
                if (cell.numRowsInSpan > 0) {
                    this.renderCellShading(cell);
                    this.renderCellBorder(cell, table.style);
                    cell.pars.forEach(par => {
                        this._parRenderer.renderParagraph(par);
                    });
                }
            });
        });
    }
    
    private renderCellShading(cell: TableCell): void {
        const bounds = cell.bounds;
        if (cell.style.shading !== "" && bounds !== undefined) {
            const y = bounds.y + (bounds.height / 2);
            this._painter.paintLine(
                bounds.left,
                y,
                bounds.right,
                y,
                cell.style.shading,
                bounds.height,
                DashMode.Solid
            );
        }
    }

    private renderCellBorder(cell: TableCell, style: TableStyle): void {
        let outerBorders: TableBorderSet | undefined = style.borders;
        const innerBorders = cell.style.borders;
        // Resolve border conflicts
        if (style.cellSpacing === 0 && cell.style.hasBordersDefined) {
            // Disable cell borders defined at table level.
            outerBorders = undefined;
        }
        let bounds = cell.bounds;
        if (bounds === undefined) {
            return;
        }
        if (outerBorders !== undefined) {
            if (outerBorders.borderTop !== undefined) {
                this._renderBorderPart(
                    outerBorders.borderTop,
                    {
                        x1: bounds.left,
                        y1: bounds.top,
                        x2: bounds.right,
                        y2: bounds.top,
                        color: outerBorders.borderTop.color
                    }
                );
            }
            if (outerBorders.borderBottom !== undefined) {
                this._renderBorderPart(
                    outerBorders.borderBottom,
                    {
                        x1: bounds.right,
                        y1: bounds.bottom,
                        x2: bounds.left,
                        y2: bounds.bottom,
                        color: outerBorders.borderBottom.color
                    }
                );
            }
            if (outerBorders.borderStart !== undefined) {
                this._renderBorderPart(
                    outerBorders.borderStart,
                    {
                        x1: bounds.x,
                        y1: bounds.bottom,
                        x2: bounds.x,
                        y2: bounds.top,
                        color: outerBorders.borderStart.color
                    }
                );
            }
            if (outerBorders.borderEnd !== undefined) {
                this._renderBorderPart(
                    outerBorders.borderEnd,
                    {
                        x1: bounds.right,
                        y1: bounds.top,
                        x2: bounds.right,
                        y2: bounds.bottom,
                        color: outerBorders.borderEnd.color
                    }
                );
            }
        }
        if (innerBorders !== undefined) {
            bounds.subtractSpacing(style.cellSpacing);
            if (innerBorders.borderTop !== undefined) {
                this._renderBorderPart(
                    innerBorders.borderTop,
                    {
                        x1: bounds.left,
                        y1: bounds.top,
                        x2: bounds.right,
                        y2: bounds.top,
                        color: innerBorders.borderTop.color
                    }
                );
            }
            if (innerBorders.borderBottom !== undefined) {
                this._renderBorderPart(
                    innerBorders.borderBottom,
                    {
                        x1: bounds.right,
                        y1: bounds.bottom,
                        x2: bounds.left,
                        y2: bounds.bottom,
                        color: innerBorders.borderBottom.color
                    }
                );
            }
            if (innerBorders.borderStart !== undefined) {
                this._renderBorderPart(
                    innerBorders.borderStart,
                    {
                        x1: bounds.x,
                        y1: bounds.bottom,
                        x2: bounds.x,
                        y2: bounds.top,
                        color: innerBorders.borderStart.color
                    }
                );
            }
            if (innerBorders.borderEnd !== undefined) {
                this._renderBorderPart(
                    innerBorders.borderEnd,
                    {
                        x1: bounds.right,
                        y1: bounds.top,
                        x2: bounds.right,
                        y2: bounds.bottom,
                        color: innerBorders.borderEnd.color
                    }
                );
            }
        }
    }
    
    private _renderBorderPart(border: TableBorder, line: IColoredLine): void {
        let relativeSize = border.size;
        switch (border.type) {
            case TableBorderType.None:
                break;
            case TableBorderType.Double:
                this._renderBorderSubLines(line, [{ pos: 0, width: border.size * 2, dashing: DashMode.Solid}]);
                break;
            case TableBorderType.Triple:
                this._renderBorderSubLines(line, [{ pos: 0, width: border.size * 3, dashing: DashMode.Solid}]);
                break;
            case TableBorderType.ThickThinLargeGap:
                relativeSize /= 12;
                this._renderBorderSubLines(line, [
                    { pos: 2.5 * relativeSize, width: 5 * relativeSize, dashing: DashMode.Solid},
                    { pos: 10.5 * relativeSize, width: relativeSize, dashing: DashMode.Solid}
                ]);
                break;
            case TableBorderType.ThickThinMediumGap:
                relativeSize /= 10;
                this._renderBorderSubLines(line, [
                    { pos: 2.5 * relativeSize, width: 5 * relativeSize, dashing: DashMode.Solid},
                    { pos: 8.5 * relativeSize, width: relativeSize, dashing: DashMode.Solid}
                ]);
                break;
            case TableBorderType.ThickThinSmallGap:
                relativeSize /= 8;
                this._renderBorderSubLines(line, [
                    { pos: 2.5 * relativeSize, width: 5 * relativeSize, dashing: DashMode.Solid},
                    { pos: 6.5 * relativeSize, width: relativeSize, dashing: DashMode.Solid}
                ]);
                break;
            case TableBorderType.ThinThickLargeGap:
                relativeSize /= 12;
                this._renderBorderSubLines(line, [
                    { pos: 0.5 * relativeSize, width: relativeSize, dashing: DashMode.Solid},
                    { pos: 8.5 * relativeSize, width: 5 * relativeSize, dashing: DashMode.Solid}
                ]);
                break;
            case TableBorderType.ThinThickMediumGap:
                relativeSize /= 10;
                this._renderBorderSubLines(line, [
                    { pos: 0.5 * relativeSize, width: relativeSize, dashing: DashMode.Solid},
                    { pos: 6.5 * relativeSize, width: 5 * relativeSize, dashing: DashMode.Solid}
                ]);
                break;
            case TableBorderType.ThinThickSmallGap:
                relativeSize /= 8;
                this._renderBorderSubLines(line, [
                    { pos: 0.5 * relativeSize, width: relativeSize, dashing: DashMode.Solid},
                    { pos: 4.5 * relativeSize, width: 5 * relativeSize, dashing: DashMode.Solid}
                ]);
                break;
            case TableBorderType.ThinThickThinLargeGap:
                relativeSize /= 18;
                this._renderBorderSubLines(line, [
                    { pos: 0.5 * relativeSize, width: relativeSize, dashing: DashMode.Solid},
                    { pos: 8.5 * relativeSize, width: 5 * relativeSize, dashing: DashMode.Solid},
                    { pos: 16.5 * relativeSize, width: relativeSize, dashing: DashMode.Solid}
                ]);
                break;
            case TableBorderType.ThinThickThinMediumGap:
                relativeSize /= 14;
                this._renderBorderSubLines(line, [
                    { pos: 0.5 * relativeSize, width: relativeSize, dashing: DashMode.Solid},
                    { pos: 2.5 * relativeSize, width: 5 * relativeSize, dashing: DashMode.Solid},
                    { pos: 12.5 * relativeSize, width: relativeSize, dashing: DashMode.Solid}
                ]);
                break;
            case TableBorderType.ThinThickThinSmallGap:
                relativeSize /= 10;
                this._renderBorderSubLines(line, [
                    { pos: 0.5 * relativeSize, width: relativeSize, dashing: DashMode.Solid},
                    { pos: 4.5 * relativeSize, width: 5 * relativeSize, dashing: DashMode.Solid},
                    { pos: 8.5 * relativeSize, width: relativeSize, dashing: DashMode.Solid}
                ]);
                break;
            case TableBorderType.DashDotStroked:
                relativeSize /= 3;
                this._renderBorderSubLines(line, [
                    {pos: 0.5 * relativeSize, width: relativeSize, dashing: DashMode.Dashed},
                    {pos: 2.5 * relativeSize, width: relativeSize, dashing: DashMode.Dotted}
                ]);
                break;
            case TableBorderType.Dashed:
                this._renderBorderSubLines(line, [{pos: 0, width: border.size, dashing: DashMode.Dashed}]);
                break;
            case TableBorderType.DashSmallGap:
                this._renderBorderSubLines(line, [{pos: 0, width: border.size, dashing: DashMode.DashedSmallGap}]);
                break;
            case TableBorderType.DotDash:
                relativeSize /= 3;
                this._renderBorderSubLines(line, [
                    {pos: 0.5 * relativeSize, width: relativeSize, dashing: DashMode.Dotted},
                    {pos: 2.5 * relativeSize, width: relativeSize, dashing: DashMode.Dashed}
                ]);
                break;
            case TableBorderType.DotDotDash:
                relativeSize /= 5;
                this._renderBorderSubLines(line, [
                    {pos: 0.5 * relativeSize, width: relativeSize, dashing: DashMode.Dotted},
                    {pos: 2.5 * relativeSize, width: relativeSize, dashing: DashMode.Dotted},
                    {pos: 4.5 * relativeSize, width: relativeSize, dashing: DashMode.Dashed}
                ]);
                break;
            case TableBorderType.Dotted:
                this._renderBorderSubLines(line, [{pos: 0, width: border.size, dashing: DashMode.Dotted}]);
                break;
            case TableBorderType.Single:
            default:
                this._renderBorderSubLines(line, [{pos: 0, width: border.size, dashing: DashMode.Solid}]);
                break;
        }
    }

    private _renderBorderSubLines(line: IColoredLine, subLines: ISubLine[]): void {
        const xDirection = (line.x1 === line.x2) ? ((line.y1 < line.y2) ? -1 : 1) : 0;
        const yDirection = (line.y1 === line.y2) ? ((line.x1 > line.x2) ? -1 : 1) : 0;
        subLines.forEach(sub => {
            this._painter.paintLine(
                line.x1 + xDirection * sub.pos,
                line.y1 + yDirection * sub.pos,
                line.x2 + xDirection * sub.pos,
                line.y2 + yDirection * sub.pos,
                line.color,
                sub.width,
                sub.dashing
            );
        });
    }
}