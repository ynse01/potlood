import { VirtualFlow } from "../utils/virtual-flow.js";
import { TextRun } from "./text-run.js";
import { IPositionedTextLine } from "./positioned-text-line.js";
import { UnderlineMode } from "./run-style.js";
import { IPainter } from "../painting/i-painter.js";
import { Style } from "./style.js";

export class TextRenderer {
    private _painter: IPainter;

    constructor(painter: IPainter) {
        this._painter = painter;
    }

    public renderTextRun(run: TextRun, flow: VirtualFlow): void {
        run.getFlowLines(flow).forEach((line: IPositionedTextLine) => {
            this._renderText(line, run.style);
        });
    }
    
    private _renderText(line: IPositionedTextLine, style: Style): void {
        const x = this._getX(line);
        if (style.shadingColor !== "000000") {
            this._painter.paintLine(x, line.y, x + line.width, line.y, style.shadingColor, style.lineSpacing);
        }
        this._painter.paintText(x, line.y, line.width, line.fitWidth, line.text, style.color, style.justification, style.fontFamily, style.fontSize, style.bold, style.italic);
        if (style.underlineMode !== UnderlineMode.none || style.strike || style.doubleStrike) {
            // Render underline after adding text to DOM.
            this._renderUnderline(style);
        }
    }
    
    private _renderUnderline(style: Style): void {
        // TODO: Support all underline modes
        const textRect = this._painter.measureLastText();
        const fontSize = style.fontSize;
        const y = textRect.y + fontSize;
        switch(style.underlineMode) {
            case UnderlineMode.double:
                this._painter.paintLine(textRect.x, y, textRect.x + textRect.width, y + fontSize / 10, style.color, 1);
                this._painter.paintLine(textRect.x, y, textRect.x + textRect.width, y + fontSize / 10, style.color, 1);
                break;
            case UnderlineMode.none:
                // Nothing to be done
                break;
            default:
            case UnderlineMode.single:
                this._painter.paintLine(textRect.x, y, textRect.x + textRect.width, y + fontSize / 10, style.color, 1);
                break;
        }
        if (style.strike) {
            this._painter.paintLine(textRect.x, y, textRect.x + textRect.width, y - fontSize / 2, style.color, 1);
        }
        if (style.doubleStrike) {
            this._painter.paintLine(textRect.x, y, textRect.x + textRect.width, y - (fontSize / 2) - 1, style.color, 1);
            this._painter.paintLine(textRect.x, y, textRect.x + textRect.width, y - (fontSize / 2) + 2, style.color, 1);
        }
    }

    private _getX(line: IPositionedTextLine): number {
        let x = line.x;
        if (line.following) {
            const rect = this._painter.measureLastText();
            x = rect.x + rect.width;
        }
        return x;
    }
}