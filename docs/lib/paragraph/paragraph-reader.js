import { Xml } from "../utils/xml.js";
import { Paragraph } from "./paragraph.js";
import { TextRun } from "../text/text-run.js";
import { TextReader } from "../text/text-reader.js";
import { ParStyle } from "./par-style.js";
import { DrawingReader } from "../drawing/drawing-reader.js";
import { InSequence } from "../utils/in-sequence.js";
export class ParagraphReader {
    static readParagraph(docx, pNode) {
        let numberingRun;
        const runs = [];
        const parStyle = this.readStyle(docx, pNode);
        if (parStyle !== undefined && parStyle._numStyle !== undefined) {
            numberingRun = new TextRun([parStyle._numStyle.getPrefixText()], parStyle._numStyle.style);
        }
        pNode.childNodes.forEach(node => {
            if (node.nodeName === "w:hyperlink") {
                const firstChild = node.firstChild;
                if (firstChild !== null) {
                    node = firstChild;
                }
            }
            if (node.nodeName === "w:r") {
                const drawingNode = Xml.getFirstChildOfName(node, "w:drawing");
                if (drawingNode !== undefined) {
                    const drawing = DrawingReader.readDrawingRun(drawingNode, docx);
                    runs.push(drawing);
                }
                else {
                    const run = TextReader.readTextRun(node, parStyle, docx.styles);
                    run.inParagraph = InSequence.Middle;
                    runs.push(run);
                }
            }
        });
        const firstRun = numberingRun || runs[0];
        if (runs.length == 1 && firstRun instanceof TextRun) {
            firstRun.inParagraph = InSequence.Only;
        }
        else if (runs.length > 0) {
            if (firstRun instanceof TextRun) {
                firstRun.inParagraph = InSequence.First;
            }
            const lastRun = runs[runs.length - 1];
            if (lastRun instanceof TextRun) {
                lastRun.inParagraph = InSequence.Last;
            }
        }
        return new Paragraph(runs, numberingRun);
    }
    static readStyle(docx, pNode) {
        const parPrNode = Xml.getFirstChildOfName(pNode, "w:pPr");
        if (parPrNode !== undefined) {
            const parStyle = ParStyle.fromParPresentationNode(parPrNode);
            parStyle.applyNamedStyles(docx.styles);
            parStyle.applyNumberings(docx.numberings);
            return parStyle;
        }
        return new ParStyle();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyYWdyYXBoLXJlYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wYXJhZ3JhcGgvcGFyYWdyYXBoLXJlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDdEMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM5QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFHcEQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFckQsTUFBTSxPQUFPLGVBQWU7SUFDakIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFlLEVBQUUsS0FBVztRQUNwRCxJQUFJLFlBQWlDLENBQUM7UUFDdEMsTUFBTSxJQUFJLEdBQTZCLEVBQUUsQ0FBQztRQUMxQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM3QyxJQUFJLFFBQVEsS0FBSyxTQUFTLElBQUksUUFBUSxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUU7WUFDNUQsWUFBWSxHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDOUY7UUFDRCxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM1QixJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssYUFBYSxFQUFFO2dCQUNqQyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO2dCQUNuQyxJQUFJLFVBQVUsS0FBSyxJQUFJLEVBQUU7b0JBQ3JCLElBQUksR0FBRyxVQUFVLENBQUM7aUJBQ3JCO2FBQ0o7WUFDRCxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssS0FBSyxFQUFFO2dCQUN6QixNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUMvRCxJQUFJLFdBQVcsS0FBSyxTQUFTLEVBQUU7b0JBQzNCLE1BQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQyxjQUFjLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUNoRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUN0QjtxQkFBTTtvQkFDSCxNQUFNLEdBQUcsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUNoRSxHQUFHLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUM7b0JBQ3BDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ2xCO2FBQ0o7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sUUFBUSxHQUFHLFlBQVksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekMsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxRQUFRLFlBQVksT0FBTyxFQUFFO1lBQ2pELFFBQVEsQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQztTQUMxQzthQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDeEIsSUFBSSxRQUFRLFlBQVksT0FBTyxFQUFFO2dCQUM3QixRQUFRLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7YUFDM0M7WUFDRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN0QyxJQUFJLE9BQU8sWUFBWSxPQUFPLEVBQUU7Z0JBQzVCLE9BQU8sQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQzthQUN6QztTQUNKO1FBQ0QsT0FBTyxJQUFJLFNBQVMsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBZSxFQUFFLEtBQVc7UUFDakQsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMxRCxJQUFJLFNBQVMsS0FBSyxTQUFTLEVBQUU7WUFDekIsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLHVCQUF1QixDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzdELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDMUMsT0FBTyxRQUFRLENBQUM7U0FDbkI7UUFDRCxPQUFPLElBQUksUUFBUSxFQUFFLENBQUM7SUFDMUIsQ0FBQztDQUVKIn0=