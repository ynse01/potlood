import { TextRun } from "../text/text-run.js";
import { ParStyle } from "./par-style.js";
export var ParagraphType;
(function (ParagraphType) {
    ParagraphType[ParagraphType["Text"] = 0] = "Text";
    ParagraphType[ParagraphType["TableCell"] = 1] = "TableCell";
    ParagraphType[ParagraphType["Drawing"] = 2] = "Drawing";
})(ParagraphType || (ParagraphType = {}));
export class Paragraph {
    constructor(runs, numberingRun) {
        this.type = ParagraphType.Text;
        this._runs = runs;
        this._numberingRun = numberingRun;
    }
    get style() {
        let parStyle;
        const firstRun = this._runs[0];
        if (firstRun instanceof TextRun) {
            const firstTextRun = firstRun;
            parStyle = firstTextRun.style.parStyle;
        }
        else {
            parStyle = new ParStyle();
        }
        return parStyle;
    }
    get runs() {
        return this._runs;
    }
    get numberingRun() {
        return this._numberingRun;
    }
    getUsedWidth(availableWidth) {
        let usedWidth = 0;
        const runs = this.runs;
        for (let i = 0; i < runs.length; i++) {
            const runsWidth = runs[i].getUsedWidth(availableWidth);
            if (runsWidth >= availableWidth) {
                usedWidth = availableWidth;
                break;
            }
            usedWidth += runsWidth;
        }
        return Math.min(usedWidth, availableWidth);
    }
    getHeight(width) {
        const style = this.style;
        let height = (style !== undefined) ? style.spacingAfter + style.spacingBefore : 0;
        this.runs.forEach(run => {
            height += run.getHeight(width);
        });
        return height;
    }
    performLayout(flow) {
        let previousXPos = 0;
        flow.advancePosition(this.style.spacingBefore);
        this.runs.forEach(run => {
            run.previousXPos = previousXPos;
            run.performLayout(flow);
            previousXPos = run.lastXPos;
        });
        flow.advancePosition(this.style.spacingAfter);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyYWdyYXBoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BhcmFncmFwaC9wYXJhZ3JhcGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBSTlDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUUxQyxNQUFNLENBQU4sSUFBWSxhQUlYO0FBSkQsV0FBWSxhQUFhO0lBQ3JCLGlEQUFRLENBQUE7SUFDUiwyREFBYSxDQUFBO0lBQ2IsdURBQVcsQ0FBQTtBQUNmLENBQUMsRUFKVyxhQUFhLEtBQWIsYUFBYSxRQUl4QjtBQUVELE1BQU0sT0FBTyxTQUFTO0lBS2xCLFlBQVksSUFBOEIsRUFBRSxZQUFpQztRQUN6RSxJQUFJLENBQUMsSUFBSSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUM7UUFDL0IsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxZQUFZLENBQUM7SUFDdEMsQ0FBQztJQUVELElBQVcsS0FBSztRQUNaLElBQUksUUFBa0IsQ0FBQztRQUN2QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9CLElBQUksUUFBUSxZQUFZLE9BQU8sRUFBRTtZQUM3QixNQUFNLFlBQVksR0FBRyxRQUFtQixDQUFDO1lBQ3pDLFFBQVEsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztTQUMxQzthQUFNO1lBQ0gsUUFBUSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7U0FDN0I7UUFDRCxPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDO0lBRUQsSUFBVyxJQUFJO1FBQ1gsT0FBTyxJQUFJLENBQUMsS0FBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUFXLFlBQVk7UUFDbkIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzlCLENBQUM7SUFFTSxZQUFZLENBQUMsY0FBc0I7UUFDdEMsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdkIsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDakMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUN2RCxJQUFJLFNBQVMsSUFBSSxjQUFjLEVBQUU7Z0JBQzdCLFNBQVMsR0FBRyxjQUFjLENBQUM7Z0JBQzNCLE1BQU07YUFDVDtZQUNELFNBQVMsSUFBSSxTQUFTLENBQUM7U0FDMUI7UUFDRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFTSxTQUFTLENBQUMsS0FBYTtRQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3pCLElBQUksTUFBTSxHQUFHLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNwQixNQUFNLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFTSxhQUFhLENBQUMsSUFBaUI7UUFDbEMsSUFBSSxZQUFZLEdBQXVCLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDcEIsR0FBRyxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7WUFDaEMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4QixZQUFZLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNuRCxDQUFDO0NBRUoifQ==