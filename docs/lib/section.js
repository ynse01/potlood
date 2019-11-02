import { Xml } from "./utils/xml.js";
import { Metrics } from "./utils/metrics.js";
export class Section {
    // TODO: SectionType, PageOrientation and PageNumberFormat
    constructor(_doc, sectionNode) {
        this.sectionNode = sectionNode;
    }
    get pageHeight() {
        this.parseContent();
        return this._pageHeight;
    }
    get pageWidth() {
        this.parseContent();
        return this._pageWidth;
    }
    get marginTop() {
        this.parseContent();
        return this._marginTop;
    }
    get marginLeft() {
        this.parseContent();
        return this._marginLeft;
    }
    get marginBottom() {
        this.parseContent();
        return this._marginBottom;
    }
    get marginRight() {
        this.parseContent();
        return this._marginRight;
    }
    parseContent() {
        if (this._pageWidth === undefined) {
            const pageSize = Xml.getFirstChildOfName(this.sectionNode, "w:pgSz");
            if (pageSize !== undefined) {
                const width = Xml.getAttribute(pageSize, "w:w");
                if (width !== undefined) {
                    this._pageWidth = Metrics.convertTwipsToPixels(parseInt(width, 10));
                }
                const height = Xml.getAttribute(pageSize, "w:h");
                if (height !== undefined) {
                    this._pageHeight = Metrics.convertTwipsToPixels(parseInt(height, 10));
                }
            }
            const margin = Xml.getFirstChildOfName(this.sectionNode, "w:pgMar");
            if (margin !== undefined) {
                const top = Xml.getAttribute(margin, "w:top");
                if (top !== undefined) {
                    this._marginTop = parseInt(top);
                }
                const left = Xml.getAttribute(margin, "w:left");
                if (left !== undefined) {
                    this._marginLeft = parseInt(left);
                }
                const bottom = Xml.getAttribute(margin, "w:bottom");
                if (bottom !== undefined) {
                    this._marginBottom = parseInt(bottom);
                }
                const right = Xml.getAttribute(margin, "w:right");
                if (right !== undefined) {
                    this._marginRight = parseInt(right);
                }
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNyQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFN0MsTUFBTSxPQUFPLE9BQU87SUFRaEIsMERBQTBEO0lBRTFELFlBQVksSUFBZSxFQUFFLFdBQXNCO1FBQy9DLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0lBQ25DLENBQUM7SUFFRCxJQUFXLFVBQVU7UUFDakIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUM1QixDQUFDO0lBRUQsSUFBVyxTQUFTO1FBQ2hCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNwQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsQ0FBQztJQUVELElBQVcsU0FBUztRQUNoQixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDcEIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQzNCLENBQUM7SUFFRCxJQUFXLFVBQVU7UUFDakIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUM1QixDQUFDO0lBRUQsSUFBVyxZQUFZO1FBQ25CLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNwQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDOUIsQ0FBQztJQUVELElBQVcsV0FBVztRQUNsQixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDcEIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzdCLENBQUM7SUFFTyxZQUFZO1FBQ2hCLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxTQUFTLEVBQUU7WUFDL0IsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFZLENBQUM7WUFDaEYsSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO2dCQUN4QixNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDaEQsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO29CQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQ3ZFO2dCQUNELE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNqRCxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7b0JBQ3RCLElBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDekU7YUFDSjtZQUNELE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBWSxDQUFDO1lBQy9FLElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtnQkFDdEIsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQzlDLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtvQkFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ25DO2dCQUNELE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUNoRCxJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7b0JBQ3BCLElBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNyQztnQkFDRCxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDcEQsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFO29CQUN0QixJQUFJLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDekM7Z0JBQ0QsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQ2xELElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtvQkFDckIsSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ3ZDO2FBQ0o7U0FDSjtJQUNMLENBQUM7Q0FDSiJ9