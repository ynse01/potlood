import { Style } from "./style.js";
import { Metrics } from "../utils/metrics.js";
import { IPositionedTextLine } from "./positioned-text-line.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { InSequence } from "../paragraph/in-sequence.js";

export class TextFitter {

    public static getFlowLines(
        text: string,
        style: Style,
        inParagraph: InSequence,
        lastXPos: number,
        flow: VirtualFlow
    ): { lines: IPositionedTextLine[], lastXPos: number } {
        let remainder = text;
        const lines: IPositionedTextLine[] = [];
        const yDelta = Metrics.getLineSpacing(style);
        let inRun = InSequence.First;
        while(remainder.length > 0) {
            let usedWidth = 0;
            const line = TextFitter.fitText(remainder, style, flow.getWidth(), inRun, inParagraph);
            if (remainder.length === line.length) {
                // Check for last line of run.
                if (inRun === InSequence.First) {
                    inRun = InSequence.Only;
                } else {
                    inRun = InSequence.Last;
                }
                lastXPos = Metrics.getTextWidth(line, style) + style.getIndentation(inRun, inParagraph);
            }
            const xDelta = style.getIndentation(inRun, inParagraph);
            const x = flow.getX() + xDelta;
            const fitWidth = (inRun !== InSequence.Last && inRun !== InSequence.Only);
            const width = flow.getWidth() - xDelta;
            lines.push({text: line, x: x, y: flow.getY(), width: width, fitWidth: fitWidth, inRun: inRun});
            if (usedWidth === 0) {
                flow.advancePosition(yDelta);
            }
            remainder = remainder.substring(line.length);
            inRun = InSequence.Middle;
        }
        return {'lines': lines, 'lastXPos': lastXPos };
    }

    public static fitText(
        text: string,
        style: Style,
        width: number,
        inRun: InSequence,
        inParagraph: InSequence
    ): string {
        let subText = text;
        const identation = style.getIndentation(inRun, inParagraph);
        while (Metrics.getTextWidth(subText, style) + identation > width) {
            const stripped = this._stripLastWord(subText);
            if (stripped === undefined) {
                break;
            }
            subText = stripped;
        }
        return subText;
    }

    private static _stripLastWord(text: string): string | undefined {
        const stop = text.lastIndexOf(' ');
        if (stop < 0) {
            return undefined;
        }
        if (stop === 0) {
            return this._stripLastWord(text.substring(1));
        }
        return text.substring(0, stop);
    }
}