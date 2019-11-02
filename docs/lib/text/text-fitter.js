import { InSequence } from "../utils/in-sequence.js";
import { Metrics } from "../utils/metrics.js";
import { FontMetrics } from "../utils/font-metrics.js";
export class TextFitter {
    static getFlowLines(run, flow) {
        const isStartingRun = (run.inParagraph === InSequence.First || run.inParagraph === InSequence.Only);
        const isLastRun = (run.inParagraph === InSequence.Last || run.inParagraph === InSequence.Only);
        let inRun = InSequence.First;
        let currentXPadding = 0;
        let isFollowing = false;
        if (run.previousXPos !== undefined && !isStartingRun) {
            currentXPadding = run.previousXPos;
            isFollowing = true;
        }
        else {
            currentXPadding = run.style.getIndentation(inRun, run.inParagraph);
            // Text is on baseline, flow is at the top, correcting here.
            flow.advancePosition(FontMetrics.getTopToBaseline(run.style));
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
        const lines = [];
        const lineHeight = run.style.lineSpacing;
        for (let i = 0; i < words.length; i++) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC1maXR0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGV4dC90ZXh0LWZpdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFckQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUV2RCxNQUFNLE9BQU8sVUFBVTtJQUVaLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBWSxFQUFFLElBQWlCO1FBQ3RELE1BQU0sYUFBYSxHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsS0FBSyxVQUFVLENBQUMsS0FBSyxJQUFJLEdBQUcsQ0FBQyxXQUFXLEtBQUssVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BHLE1BQU0sU0FBUyxHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsS0FBSyxVQUFVLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxXQUFXLEtBQUssVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9GLElBQUksS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7UUFDN0IsSUFBSSxlQUFlLEdBQVcsQ0FBQyxDQUFDO1FBQ2hDLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN4QixJQUFJLEdBQUcsQ0FBQyxZQUFZLEtBQUssU0FBUyxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ2xELGVBQWUsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDO1lBQ25DLFdBQVcsR0FBRyxJQUFJLENBQUM7U0FDdEI7YUFBTTtZQUNILGVBQWUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ25FLDREQUE0RDtZQUM1RCxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxnQkFB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