import { IPositionedTextLine } from "./positioned-text-line.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { InSequence } from "../utils/in-sequence.js";
import { TextRun } from "./text-run.js";
import { Metrics } from "../utils/metrics.js";
import { FontMetrics } from "../utils/font-metrics.js";

export class TextFitter {

    public static getFlowLines(run: TextRun, flow: VirtualFlow): { lines: IPositionedTextLine[], lastXPos: number } {
        const isStartingRun = (run.inParagraph === InSequence.First || run.inParagraph === InSequence.Only);
        const isLastRun = (run.inParagraph === InSequence.Last || run.inParagraph === InSequence.Only);
        let inRun = InSequence.First;
        let currentXPadding: number = 0;
        let isFollowing = false;
        if (run.previousXPos === undefined || isStartingRun) {
            currentXPadding = run.style.getIndentation(inRun, run.inParagraph);
            // Text is on baseline, flow is at the top, correcting here.
            flow.advancePosition(FontMetrics.getTopToBaseline(run.style));
        } else {
            currentXPadding = run.previousXPos;
            isFollowing = true;
        }
        let txt = run.texts.join(' ');
        if (run.style.caps || run.style.smallCaps) {
            txt = txt.toLocaleUpperCase();
        }
        const words = txt.split(' ');
        let previousEnd = 0;
        let currentLength = 0;
        let numChars = FontMetrics.fitCharacters(flow.getWidth() - currentXPadding, run.style);
        let isLastLine = false;
        const lines: IPositionedTextLine[] = [];
        const lineHeight = run.style.lineSpacing;
        for(let i = 0; i < words.length; i++) {
            currentLength += words[i].length + 1;
            isLastLine = (i === words.length - 1);
            const isNewLine = words[i] === '\n';
            if (currentLength >= numChars || isLastLine || isNewLine) {
                lines.push({
                    text: txt.substr(previousEnd, currentLength),
                    x: flow.getX() + currentXPadding,
                    y: flow.getY(),
                    width: flow.getWidth() - currentXPadding,
                    fitWidth: !isLastLine,
                    following: isFollowing,
                    inRun: (isLastLine) ? InSequence.Last : inRun
                });
                if (isLastRun || !isLastLine) {
                    flow.advancePosition(lineHeight);
                }
                if (!isLastLine) {
                    isFollowing = false;
                    inRun = InSequence.Middle;
                    currentXPadding = run.style.getIndentation(inRun, run.inParagraph);
                    numChars = FontMetrics.fitCharacters(flow.getWidth() - currentXPadding, run.style);
                    previousEnd += currentLength;
                    currentLength = 0;
                }
            }
        }
        if (lines.length === 1) {
            lines[0].inRun = InSequence.Only;
        }
        if (isLastRun) {
            flow.advancePosition(FontMetrics.getBaselineToBottom(run.style));
        }
        return { lines: lines, lastXPos: currentXPadding + Metrics.getTextWidth(lines[lines.length - 1].text, run.style) };
    }
}