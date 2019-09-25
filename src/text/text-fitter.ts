import { Style } from "./style.js";
import { IPositionedTextLine } from "./positioned-text-line.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { InSequence } from "../utils/in-sequence.js";
import { Fonts } from "../utils/fonts.js";
import { Metrics } from "../utils/metrics.js";

export class TextFitter {

    public static getFlowLines(
        texts: string[],
        style: Style,
        inParagraph: InSequence,
        lastXPos: number | undefined,
        flow: VirtualFlow
    ): { lines: IPositionedTextLine[], lastXPos: number } {
        const isStartingRun = (inParagraph === InSequence.First || inParagraph === InSequence.Only);
        const isLastRun = (inParagraph === InSequence.Last || inParagraph === InSequence.Only);
        let currentXPadding = (lastXPos !== undefined && !isStartingRun) ? (lastXPos + Fonts.averageCharWidth(style)) : 0;
        let txt = texts.join(' ');
        if (style.caps || style.smallCaps) {
            txt = txt.toLocaleUpperCase();
        }
        const words = txt.split(' ');
        let previousEnd = 0;
        let currentLength = 0;
        let inRun = InSequence.First;
        let numChars = Fonts.fitCharacters(flow.getWidth() - currentXPadding, style);
        let lastLine = false;
        const lines: IPositionedTextLine[] = [];
        const lineHeight = style.lineSpacing;
        for(let i = 0; i < words.length; i++) {
            currentLength += words[i].length + 1;
            lastLine = (i === words.length - 1);
            if (currentLength >= numChars || lastLine) {
                lines.push({
                    text: txt.substr(previousEnd, currentLength),
                    x: flow.getX() + style.getIndentation(inRun, inParagraph) + currentXPadding,
                    y: flow.getY(),
                    width: flow.getWidth() - currentXPadding,
                    fitWidth: !lastLine,
                    inRun: (lastLine) ? InSequence.Last : inRun
                });
                if (isLastRun || !lastLine) {
                    flow.advancePosition(lineHeight);
                }
                if (!lastLine) {
                    currentXPadding = 0;
                    numChars = Fonts.fitCharacters(flow.getWidth() - currentXPadding, style);
                    inRun = InSequence.Middle;
                    previousEnd += currentLength;
                    currentLength = 0;
                }
            }
        }
        if (lines.length === 1) {
            lines[0].inRun = InSequence.Only;
        }
        return { lines: lines, lastXPos: currentXPadding + Metrics.getTextWidth(lines[lines.length - 1].text, style) };
    }
}