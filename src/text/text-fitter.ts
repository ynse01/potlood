import { Style } from "./style.js";
import { Metrics } from "../utils/metrics.js";
import { IPositionedTextLine } from "./positioned-text-line.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { InSequence } from "../paragraph/in-sequence.js";
import { Fonts } from "../utils/fonts.js";

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
        const yDelta = style.lineSpacing;
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
        let fittingText = text;
        const identation = style.getIndentation(inRun, inParagraph);
        const numChars = Fonts.fitCharacters(style, width - identation) * 1.2;
        const stopChar = TextFitter._findNextWordEnd(text, numChars);
        if (stopChar < text.length) {
            const subText = text.substr(0, stopChar);
            fittingText = subText;
        }
        return fittingText;
    }

    private static _findNextWordEnd(text: string, stop: number): number {
        const index = text.indexOf(' ', stop);
        if (index < 0) {
            return text.length;
        } else {
            return index;
        }
    }
}