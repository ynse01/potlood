import { IPositionedTextLine } from "./positioned-text-line.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { InSequence } from "../utils/in-sequence.js";
import { TextRun } from "./text-run.js";
import { Metrics } from "../utils/metrics.js";
import { FontMetrics } from "../utils/font-metrics.js";
import { Style } from "./style.js";

export class TextFitter {
    public lines: IPositionedTextLine[];
    public lastXPadding = 0;
    private _run: TextRun;
    private _lineHeight: number;

    constructor(run: TextRun) {
        this._run = run;
        this._lineHeight = this._run.style.lineSpacing;
        this.lines = [];
    }

    public getFlowLines(flow: VirtualFlow): void {
        let inRun = InSequence.First;
        let currentXPadding = this._getInitialXPadding();
        let isFollowing = this._getIsFollowing();
        this._fixPosition(isFollowing, this._run.style, flow);
        let txt = this._run.texts.join(' ');
        txt = this._fixCaps(txt, this._run.style);
        const words = txt.split(' ');
        let previousEnd = 0;
        let currentLength = 0;
        let numAvailableChars = FontMetrics.fitCharacters(flow.getWidth() - currentXPadding, this._run.style);
        let isLastLine = false;
        for(let i = 0; i < words.length; i++) {
            currentLength += words[i].length + 1;
            isLastLine = (i === words.length - 1);
            const isNewLine = words[i] === '\n';
            if (currentLength >= numAvailableChars || isLastLine || isNewLine) {
                inRun = (isLastLine) ? InSequence.Last : inRun;
                this._pushNewLine(txt.substr(previousEnd, currentLength), flow, isFollowing, inRun, currentXPadding);
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
        this.lastXPadding = this._finalXPadding(currentXPadding, flow);
    }

    private _pushNewLine(
        txt: string,
        flow: VirtualFlow,
        isFollowing: boolean,
        inRun: InSequence,
        xPadding: number
    ): void {
        const isLastLine = (inRun === InSequence.Last || inRun === InSequence.Only);
        const isLastRun = (this._run.inParagraph === InSequence.Last || this._run.inParagraph === InSequence.Only);
        this.lines.push({
            text: txt,
            x: flow.getX() + xPadding,
            y: flow.getY(),
            width: flow.getWidth() - xPadding,
            fitWidth: !isLastLine,
            following: isFollowing,
            inRun: inRun
        });
        if (isLastRun || !isLastLine) {
            flow.advancePosition(this._lineHeight);
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

    private _getIsFollowing(): boolean {
        let isFollowing: boolean;
        const isStartingRun = (this._run.inParagraph === InSequence.First || this._run.inParagraph === InSequence.Only);
        if (this._run.previousXPos === undefined || isStartingRun) {
            isFollowing = false;
        } else {
            isFollowing = true;
        }
        return isFollowing;
    }

    private _getInitialXPadding(): number {
        let xPadding = 0;
        const isStartingRun = (this._run.inParagraph === InSequence.First || this._run.inParagraph === InSequence.Only);
        if (this._run.previousXPos === undefined || isStartingRun) {
            xPadding = this._run.style.getIndentation(InSequence.First, this._run.inParagraph);
        } else {
            xPadding = this._run.previousXPos;
        }
        return xPadding;
    }

    private _finalXPadding(currentXPadding: number, flow: VirtualFlow): number {
        const isLastRun = (this._run.inParagraph === InSequence.Last || this._run.inParagraph === InSequence.Only);
        if (this.lines.length === 1) {
            this.lines[0].inRun = InSequence.Only;
        }
        if (isLastRun) {
            flow.advancePosition(FontMetrics.getBaselineToBottom(this._run.style));
        }
        return currentXPadding + Metrics.getTextWidth(this.lines[this.lines.length - 1].text, this._run.style);
    }
}