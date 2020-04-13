import { TextRun } from "./text-run.js";
import { IPositionedTextLine, Emphasis } from "./positioned-text-line.js";
import { UnderlineMode } from "./run-style.js";
import { IPainter, DashMode } from "../painting/i-painter.js";
import { Style } from "./style.js";
import { FontMetrics } from "../utils/font-metrics.js";

export class TextRenderer {
    private _painter: IPainter;

    constructor(painter: IPainter) {
        this._painter = painter;
    }

    public renderTextRun(run: TextRun): void {
        const linkTarget = run.linkTarget;
        if (linkTarget !== undefined) {
            this._painter.startLink(linkTarget);
        }
        run.getLines().forEach((line: IPositionedTextLine) => {
            this._renderText(line, run.style);
        });
        if (linkTarget !== undefined) {
            this._painter.endLink();
        }
    }
    
    private _renderText(line: IPositionedTextLine, style: Style): void {
        const x = this._getX(line);
        if (style.shadingColor !== "000000") {
            const lineSpacing = style.lineSpacing;
            const y = line.y - FontMetrics.getTopToBaseline(style) + lineSpacing / 2;
            this._painter.paintLine(x, y, x + line.width, y, style.shadingColor, lineSpacing, DashMode.Solid);
        }
        const justification = (line.justification !== undefined) ? line.justification : style.justification;
        const isBold = Boolean(line.emphasis & Emphasis.Bold);
        const isItalic = Boolean(line.emphasis & Emphasis.Italic);
        this._painter.paintText(x, line.y, line.width, line.stretched, line.text, line.color, justification, line.fontFamily, line.fontSize, isBold, isItalic);
        if (style.underlineMode !== UnderlineMode.None || style.strike || style.doubleStrike) {
            // Render underline after adding text to DOM.
            this._renderUnderline(style);
        }
    }
    
    private _renderUnderline(style: Style): void {
        // TODO: Support all underline modes
        const textRect = this._painter.measureLastText();
        const fontSize = style.fontSize;
        const y = textRect.y + fontSize;
        const color = (style.color === "auto") ? "000000" : style.color;
        const thickness = fontSize / 24;
        const heavy = 2 * thickness;
        switch(style.underlineMode) {
            case UnderlineMode.Double:
                this._painter.paintLine(textRect.x, y, textRect.x + textRect.width, y, color, thickness, DashMode.Solid);
                this._painter.paintLine(textRect.x, y + 3 * thickness, textRect.x + textRect.width, y + 3 * thickness, color, thickness, DashMode.Solid);
                break;
            case UnderlineMode.Thick:
                this._painter.paintLine(textRect.x, y + thickness, textRect.x + textRect.width, y + thickness, color, heavy, DashMode.Solid);
                break;
            case UnderlineMode.Dotted:
                this._painter.paintLine(textRect.x, y, textRect.x + textRect.width, y, color, thickness, DashMode.Dotted);
                break;
            case UnderlineMode.DottedHeavy:
                this._painter.paintLine(textRect.x, y + thickness, textRect.x + textRect.width, y + thickness, color, heavy, DashMode.Dotted);
                break;
            case UnderlineMode.Dash:
                this._painter.paintLine(textRect.x, y, textRect.x + textRect.width, y, color, thickness, DashMode.Dashed);
                break;
            case UnderlineMode.DashedHeavy:
                this._painter.paintLine(textRect.x, y + thickness, textRect.x + textRect.width, y + thickness, color, heavy, DashMode.Dashed);
                break;
            case UnderlineMode.DotDash:
                this._painter.paintLine(textRect.x, y, textRect.x + textRect.width, y, color, thickness, DashMode.DotDash);
                break;
            case UnderlineMode.DashDotHeavy:
                this._painter.paintLine(textRect.x, y + thickness, textRect.x + textRect.width, y + thickness, color, heavy, DashMode.DotDash);
                break;
            case UnderlineMode.DotDotDash:
                this._painter.paintLine(textRect.x, y, textRect.x + textRect.width, y, color, thickness, DashMode.DotDotDash);
                break;
            case UnderlineMode.DashDotDotHeavy:
                this._painter.paintLine(textRect.x, y + thickness, textRect.x + textRect.width, y + thickness, color, heavy, DashMode.DotDotDash);
                break;
            case UnderlineMode.DashLong:
                this._painter.paintLine(textRect.x, y, textRect.x + textRect.width, y, color, thickness, DashMode.LongDash);
                break;
            case UnderlineMode.DashLongHeavy:
                this._painter.paintLine(textRect.x, y + thickness, textRect.x + textRect.width, y + thickness, color, heavy, DashMode.LongDash);
                break;
            case UnderlineMode.None:
                // Nothing to be done
                break;
            default:
            case UnderlineMode.Single:
                this._painter.paintLine(textRect.x, y, textRect.x + textRect.width, y, color, thickness, DashMode.Solid);
                break;
        }
        if (style.strike) {
            this._painter.paintLine(textRect.x, y - fontSize / 2, textRect.x + textRect.width, y - fontSize / 2, color, 1, DashMode.Solid);
        }
        if (style.doubleStrike) {
            this._painter.paintLine(textRect.x, y, textRect.x + textRect.width, y - (fontSize / 2) - 1, color, 1, DashMode.Solid);
            this._painter.paintLine(textRect.x, y, textRect.x + textRect.width, y - (fontSize / 2) + 2, color, 1, DashMode.Solid);
        }
    }

    private _getX(line: IPositionedTextLine): number {
        let x = line.x;
        if (line.following) {
            const rect = this._painter.measureLastText();
            x = Math.max(x, rect.x + rect.width);
        }
        return x;
    }
}