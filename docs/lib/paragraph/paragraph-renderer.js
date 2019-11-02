import { TextRenderer } from "../text/text-renderer.js";
import { DrawingRenderer } from "../drawing/drawing-renderer.js";
import { TextRun } from "../text/text-run.js";
export class ParagraphRenderer {
    constructor(painter) {
        this._textRenderer = new TextRenderer(painter);
        this._drawingRenderer = new DrawingRenderer(painter);
    }
    renderParagraph(par, flow) {
        const parStyle = par.style;
        if (parStyle !== undefined) {
            flow.advancePosition(parStyle.spacingBefore);
        }
        let previousXPos = 0;
        if (par.numberingRun !== undefined) {
            this._textRenderer.renderTextRun(par.numberingRun, flow.clone());
            previousXPos = par.numberingRun.lastXPos;
        }
        par.runs.forEach((run) => {
            run.previousXPos = previousXPos;
            if (run instanceof TextRun) {
                this._textRenderer.renderTextRun(run, flow);
            }
            else {
                this._drawingRenderer.renderDrawing(run, flow);
            }
            previousXPos = run.lastXPos;
        });
        if (parStyle !== undefined) {
            flow.advancePosition(parStyle.spacingAfter);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyYWdyYXBoLXJlbmRlcmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BhcmFncmFwaC9wYXJhZ3JhcGgtcmVuZGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUVqRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFOUMsTUFBTSxPQUFPLGlCQUFpQjtJQUkxQixZQUFZLE9BQWlCO1FBQ3pCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFTSxlQUFlLENBQUMsR0FBYyxFQUFFLElBQWlCO1FBQ3BELE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7UUFDM0IsSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO1lBQ3hCLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ2hEO1FBQ0QsSUFBSSxZQUFZLEdBQXVCLENBQUMsQ0FBQztRQUN6QyxJQUFJLEdBQUcsQ0FBQyxZQUFZLEtBQUssU0FBUyxFQUFFO1lBQ2xDLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDakUsWUFBWSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDO1NBQzFDO1FBQ0QsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNyQixHQUFHLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztZQUNoQyxJQUFJLEdBQUcsWUFBWSxPQUFPLEVBQUU7Z0JBQ3hCLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQzthQUMvQztpQkFBTTtnQkFDSCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQzthQUNsRDtZQUNELFlBQVksR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDO1FBQ2hDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO1lBQ3hCLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQy9DO0lBQ0wsQ0FBQztDQUNKIn0=