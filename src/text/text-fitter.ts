import { IPositionedTextLine } from "./positioned-text-line";
import { VirtualFlow } from "../utils/virtual-flow";
import { InSequence } from "../utils/in-sequence";
import { TextRun } from "./text-run";
import { Metrics } from "../utils/metrics";
import { FontMetrics } from "../utils/font-metrics";
import { Style } from "./style";
import { Justification } from "../paragraph/par-style";
import { WordSplitter, WordSeperator } from "./word-splitter";
import { ParagraphType } from "../paragraph/paragraph";

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
        let isFollowing = this._isFollowing;
        if (this._run.hasEmptyText) {
            this.lastXPadding = currentXPadding;
            return;
        }
        this._fixYPosition(isFollowing, flow);
        const texts = this._fixAllCaps(this._run.texts);
        const splitter = new WordSplitter(texts);
        const words = splitter.words;
        if (this._run.texts.length === 1 && this._run.texts[0] === " ") {
            this.lastXPadding = currentXPadding + FontMetrics.averageCharWidth(this._run.style);
            return;
        }
        const strictFit = this._run.paragraphType === ParagraphType.TableCell;
        let tabIndex = 0;
        let previousIndex = 0;
        let currentLength = 0;
        let numAvailableChars = this._getAvailableChars(currentXPadding, flow);
        let isLastLine = false;
        let justification = this._run.style.justification;
        for(let i = 0; i < words.length; i++) {
            currentLength += words[i].length + 1;
            isLastLine = (i === words.length - 1);
            const seperator = splitter.getSeperator(i);
            const isNewLine = seperator === WordSeperator.LineFeed;
            const isTab = seperator === WordSeperator.Tab;
            let reachedEndOfLine = isLastLine || isNewLine || isTab;
            if (!reachedEndOfLine && !this._fitReasonably(currentLength, numAvailableChars, strictFit, words[i + 1])) {
                // Next word would go over the boundary, chop now.
                reachedEndOfLine = true;
            }
            if (reachedEndOfLine) {
                inRun = (isLastLine) ? InSequence.Last : inRun;
                // Ready to push the line out to the renderer.
                this._pushNewLine(splitter.combine(previousIndex, i), flow, isFollowing, isTab, inRun, currentXPadding, justification, this._run.style);
                // Resetting the state for next line.
                if (!isLastLine) {
                    isFollowing = false;
                    inRun = InSequence.Middle;
                    if (isTab) {
                        currentXPadding = this._getTabPadding(tabIndex, flow);
                        justification = this._getTabJustification(tabIndex, this._run.style, flow);
                        tabIndex++;
                    } else {
                        currentXPadding = this._getIndentation(inRun);
                        tabIndex = 0;
                    }
                    numAvailableChars = this._getAvailableChars(currentXPadding, flow);
                    currentLength = 0;
                    previousIndex = i + 1;
                }
            }
        }
        this.lastXPadding = this._finalXPadding(currentXPadding, flow);
    }

    private get _isFirstRun(): boolean {
        return (this._run.inParagraph === InSequence.First || this._run.inParagraph === InSequence.Only);
    }

    private get _isLastRun(): boolean {
        return (this._run.inParagraph === InSequence.Last || this._run.inParagraph === InSequence.Only);        
    }

    private _pushNewLine(
        txt: string,
        flow: VirtualFlow,
        isFollowing: boolean,
        isTab: boolean,
        inRun: InSequence,
        xPadding: number,
        justification: Justification,
        style: Style
    ): void {
        const isLastLine = (inRun === InSequence.Last || inRun === InSequence.Only);
        const isLastRun = (this._run.inParagraph === InSequence.Last || this._run.inParagraph === InSequence.Only);
        const stretched = (style.justification === Justification.both) && !isLastLine;
        this.lines.push({
            text: txt,
            x: flow.getX() + xPadding,
            y: flow.getY(),
            width: flow.getWidth() - xPadding,
            stretched: stretched,
            following: isFollowing,
            color: style.color,
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
            emphasis: style.emphasis,
            justification: justification
        });
        if (!isTab && (isLastRun || !isLastLine)) {
            flow.advancePosition(this._lineHeight);
        }
    }

    private _fixAllCaps(txts: string[]): string[] {
        if (this._run.style.caps || this._run.style.smallCaps) {
            txts = txts.map((txt) => txt.toLocaleUpperCase());
        }
        return txts;
    }

    private _fixYPosition(isFollowing: boolean, flow: VirtualFlow): void {
        if (!isFollowing) {
            // Text is on baseline, flow is at the top, correcting here.
            flow.advancePosition(FontMetrics.getTopToBaseline(this._run.style));
        }
    }

    private get _isFollowing(): boolean {
        let isFollowing: boolean;
        if (this._run.previousXPos === undefined || this._isFirstRun) {
            isFollowing = false;
        } else {
            isFollowing = true;
        }
        return isFollowing;
    }

    private _getIndentation(inRun: InSequence): number {
        return this._run.style.getIndentation(inRun, this._run.inParagraph);
    }

    private _getTabPadding(tabIndex: number, flow: VirtualFlow): number {
        let padding = 0;
        const tab = flow.getTab(tabIndex);
        if (tab !== undefined && tab.position !== undefined) {
            padding = tab.position;
        }
        return padding;
    }

    private _getTabJustification(tabIndex: number, style: Style, flow: VirtualFlow): Justification {
        let justification = style.justification;
        const tab = flow.getTab(tabIndex);
        if (tab !== undefined) {
            justification = tab.justification;
        }
        return justification;
    }

    private _getAvailableChars(xPadding: number, flow: VirtualFlow): number {
        return FontMetrics.fitCharacters(flow.getWidth() - xPadding, this._run.style);
    }

    /**
     * Does the next word fit reasonably.
     */
    private _fitReasonably(length: number, numAvailableChars: number, strictFit: boolean, nextWord: string | undefined): boolean {
        if (nextWord === undefined) {
            return true;
        }
        const graceNumber = strictFit ? 0 : 1;
        const nextLength = length + nextWord.length;
        const numAcceptableChars = numAvailableChars + graceNumber;
        return nextLength <= numAcceptableChars;
    }

    private _getInitialXPadding(): number {
        let xPadding = 0;
        if (this._run.previousXPos === undefined || this._isFirstRun) {
            xPadding = this._getIndentation(InSequence.First);
        } else {
            xPadding = this._run.previousXPos;
        }
        return xPadding;
    }

    private _finalXPadding(currentXPadding: number, flow: VirtualFlow): number {
        if (this._isLastRun) {
            flow.advancePosition(FontMetrics.getBaselineToBottom(this._run.style));
        }
        const lastLineWidth = Metrics.getTextWidth(this.lines[this.lines.length - 1].text, this._run.style);
        return currentXPadding + lastLineWidth;
    }
}