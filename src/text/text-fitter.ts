import { Style } from "./style.js";
import { IPositionedTextLine } from "./positioned-text-line.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { InSequence } from "../paragraph/in-sequence.js";
import { Fonts } from "../utils/fonts.js";

export class TextFitter {

    public static getFlowLines(
        text: string,
        style: Style,
        inParagraph: InSequence,
        _lastXPos: number,
        flow: VirtualFlow
    ): { lines: IPositionedTextLine[], lastXPos: number } {
        const words = text.split(' ');
        let previousEnd = 0;
        let currentLength = 0;
        let numChars = Fonts.fitCharacters(flow.getWidth(), style);
        let inRun = InSequence.First;
        const lines: IPositionedTextLine[] = [];
        const lineHeight = style.lineSpacing;
        for(let i = 0; i < words.length; i++) {
            currentLength += words[i].length + 1;
            if (currentLength >= numChars || i === words.length - 1) {
                lines.push({
                    text: text.substr(previousEnd, currentLength),
                    x: flow.getX() + style.getIndentation(inRun, inParagraph),
                    y: flow.getY(),
                    width: flow.getWidth(),
                    fitWidth: (i !== words.length - 1),
                    inRun: inRun
                });
                flow.advancePosition(lineHeight);
                numChars = Fonts.fitCharacters(flow.getWidth(), style);
                inRun = InSequence.Middle;
                previousEnd += currentLength;
                currentLength = 0;
            }
        }
        return { lines: lines, lastXPos: 0 };
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
        const numChars = Fonts.fitCharacters(width - identation, style);
        const stopChar = TextFitter._findNextWordEnd(text, numChars);
        if (stopChar < text.length) {
            const subText = text.substr(0, stopChar);
            fittingText = subText;
        }
        return fittingText;
    }
/*
    private static _findPreviousWordEnd(text: string, stop: number): number {
        const index = text.lastIndexOf(' ', stop);
        if (index < 0) {
            return stop;
        } else {
            return index;
        }
    }
*/
    private static _findNextWordEnd(text: string, stop: number): number {
        const index = text.indexOf(' ', stop);
        if (index < 0) {
            return text.length;
        } else {
            return index;
        }
    }
}