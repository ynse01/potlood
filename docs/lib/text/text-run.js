import { VirtualFlow } from "../utils/virtual-flow.js";
import { InSequence } from "../utils/in-sequence.js";
import { TextFitter } from "./text-fitter.js";
import { Metrics } from "../utils/metrics.js";
export class TextRun {
    constructor(texts, style) {
        this.inParagraph = InSequence.Only;
        this.lastXPos = 0;
        this._lines = undefined;
        this.style = style;
        this.texts = texts;
    }
    getUsedWidth(availableWidth) {
        let usedWidth = 0;
        const lines = this.getLines(availableWidth);
        if (lines.length > 1) {
            usedWidth = availableWidth;
        }
        else {
            usedWidth = lines[0].width;
        }
        return usedWidth;
    }
    getWidthOfLastLine(availableWidth) {
        const lines = this.getLines(availableWidth);
        return Metrics.getTextWidth(lines[lines.length - 1].text, this.style);
    }
    getHeight(width) {
        return this.getLines(width).length * this.style.lineSpacing;
    }
    getLines(width) {
        let lines;
        if (this._lines !== undefined) {
            lines = this._lines;
        }
        else {
            const flow = new VirtualFlow(0, width, 0);
            lines = this.getFlowLines(flow);
        }
        return lines;
    }
    performLayout(flow) {
        if (this._lines === undefined) {
            this._lines = this.getFlowLines(flow);
        }
    }
    getFlowLines(flow) {
        let lines = [];
        if (!this.style.invisible) {
            const result = TextFitter.getFlowLines(this, flow);
            this.lastXPos = result.lastXPos;
            lines = result.lines;
        }
        else {
            this.lastXPos = 0;
        }
        return lines;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC1ydW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGV4dC90ZXh0LXJ1bi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDdkQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBR3JELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFOUMsTUFBTSxPQUFPLE9BQU87SUFRaEIsWUFBWSxLQUFlLEVBQUUsS0FBWTtRQUxsQyxnQkFBVyxHQUFlLFVBQVUsQ0FBQyxJQUFJLENBQUM7UUFFMUMsYUFBUSxHQUFHLENBQUMsQ0FBQztRQUNaLFdBQU0sR0FBc0MsU0FBUyxDQUFDO1FBRzFELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUFFTSxZQUFZLENBQUMsY0FBc0I7UUFDdEMsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDNUMsSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNsQixTQUFTLEdBQUcsY0FBYyxDQUFDO1NBQzlCO2FBQU07WUFDSCxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztTQUM5QjtRQUNELE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFFTSxrQkFBa0IsQ0FBQyxjQUFzQjtRQUM1QyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzVDLE9BQU8sT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFTSxTQUFTLENBQUMsS0FBYTtRQUMxQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO0lBQ2hFLENBQUM7SUFFTSxRQUFRLENBQUMsS0FBYTtRQUN6QixJQUFJLEtBQTRCLENBQUM7UUFDakMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtZQUMzQixLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUN2QjthQUFNO1lBQ0gsTUFBTSxJQUFJLEdBQUcsSUFBSSxXQUFXLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMxQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNuQztRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFTSxhQUFhLENBQUMsSUFBaUI7UUFDbEMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtZQUMzQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDekM7SUFDTCxDQUFDO0lBRU0sWUFBWSxDQUFDLElBQWlCO1FBQ2pDLElBQUksS0FBSyxHQUEwQixFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFO1lBQ3ZCLE1BQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztZQUNoQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztTQUN4QjthQUFNO1lBQ0gsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7U0FDckI7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0NBQ0oifQ==