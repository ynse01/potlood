import { IPositionedTextLine } from "./positioned-text-line.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { InSequence } from "../utils/in-sequence.js";
import { TextRun } from "./text-run.js";
import { Metrics } from "../utils/metrics.js";
import { FontMetrics } from "../utils/font-metrics.js";
import { Style } from "./style.js";

export class TextFitter {
    private _run: TextRun;

    constructor(run: TextRun) {
        this._run = run;
    }

    public getFlowLines(flow: VirtualFlow): { lines: IPositionedTextLine[], lastXPos: number } {
        let inRun = InSequence.First;
        let currentXPadding = this._getInitialXPadding(this._run);
        let isFollowing = this._getIsFollowing(this._run);
        this._fixPosition(isFollowing, this._run.style, flow);
        let txt = this._run.texts.join(' ');
        txt = this._fixCaps(txt, this._run.style);
        const words = txt.split(' ');
        let previousEnd = 0;
        let currentLength = 0;
        let numAvailableChars = FontMetrics.fitCharacters(flow.getWidth() - currentXPadding, this._run.style);
        let isLastLine = false;
        const lines: IPositionedTextLine[] = [];
        const lineHeight = this._run.style.lineSpacing;
        for(let i = 0; i < words.length; i++) {
            currentLength += words[i].length + 1;
            isLastLine = (i === words.length - 1);
            const isNewLine = words[i] === '\n';
            if (currentLength >= numAvailableChars || isLastLine || isNewLine) {
                inRun = (isLastLine) ? InSequence.Last : inRun;
                this._pushNewLine(lines, txt.substr(previousEnd, currentLength), flow, isFollowing, this._run.inParagraph, inRun, currentXPadding, lineHeight);
                if (!isLastLine) {
                    isFollowing = false;
                    inRun = InSequence.Middle;
                    currentXPadding = this._run.style.getIndentation(inRun, this._run.inParagraph);
                    numAvailableChars = FontMetrics.fitCharacters(flow.getWidth() - currentXPadding, this._run.style);
                    previousEnd += currentLength;
                    currentLength = 0;
                }
            }
        }
        const lastXPadding = this._finalXPadding(lines, this._run, currentXPadding, flow);
        return { lines: lines, lastXPos: lastXPadding };
    }

    private _pushNewLine(
        lines: IPositionedTextLine[],
        txt: string,
        flow: VirtualFlow,
        isFollowing: boolean,
        inParagraph: InSequence,
        inRun: InSequence,
        xPadding: number,
        lineHeight: number
    ): void {
        const isLastLine = (inRun === InSequence.Last || inRun === InSequence.Only);
        const isLastRun = (inParagraph === InSequence.Last || inParagraph === InSequence.Only);
        lines.push({
            text: txt,
            x: flow.getX() + xPadding,
            y: flow.getY(),
            width: flow.getWidth() - xPadding,
            fitWidth: !isLastLine,
            following: isFollowing,
            inRun: inRun
        });
        if (isLastRun || !isLastLine) {
            flow.advancePosition(lineHeight);
        }
    }

    private _fixCaps(txt: string, style: Style): string {
        if (style.caps || style.smallCaps) {
            txt = txt.toLocaleUpperCase();
        }
        return txt;
    }

    private _fixPosition(isFollowing: boolean, style: Style, flow: VirtualFlow): void {
        if (!isFollowing) {
            // Text is on baseline, flow is at the top, correcting here.
            flow.advancePosition(FontMetrics.getTopToBaseline(style));
        }
    }

    private _getIsFollowing(run: TextRun): boolean {
        let isFollowing: boolean;
        const isStartingRun = (run.inParagraph === InSequence.First || run.inParagraph === InSequence.Only);
        if (run.previousXPos === undefined || isStartingRun) {
            isFollowing = false;
        } else {
            isFollowing = true;
        }
        return isFollowing;
    }

    private _getInitialXPadding(run: TextRun): number {
        let xPadding = 0;
        const isStartingRun = (run.inParagraph === InSequence.First || run.inParagraph === InSequence.Only);
        if (run.previousXPos === undefined || isStartingRun) {
            xPadding = run.style.getIndentation(InSequence.First, run.inParagraph);
        } else {
            xPadding = run.previousXPos;
        }
        return xPadding;
    }

    private _finalXPadding(lines: IPositionedTextLine[], run: TextRun, currentXPadding: number, flow: VirtualFlow): number {
        const isLastRun = (run.inParagraph === InSequence.Last || run.inParagraph === InSequence.Only);
        if (lines.length === 1) {
            lines[0].inRun = InSequence.Only;
        }
        if (isLastRun) {
            flow.advancePosition(FontMetrics.getBaselineToBottom(run.style));
        }
        return currentXPadding + Metrics.getTextWidth(lines[lines.length - 1].text, run.style);
    }
}