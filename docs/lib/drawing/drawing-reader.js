import { DrawingRun } from "./drawing-run.js";
import { ShapeBounds } from "./shape-bounds.js";
import { Xml } from "../utils/xml.js";
import { Picture } from "./picture.js";
import { ChartSpace } from "../chart/chart-space.js";
import { ChartReader } from "../chart/chart-reader.js";
export class DrawingReader {
    static readDrawingRun(drawingNode, docx) {
        let bounds = new ShapeBounds();
        const child = drawingNode.childNodes[0];
        if (child.nodeName === "wp:anchor") {
            bounds = ShapeBounds.fromAnchorNode(child);
        }
        else if (child.nodeName === "wp:inline") {
            bounds = ShapeBounds.fromInlineNode(child);
        }
        const drawing = new DrawingRun(bounds);
        const graphic = Xml.getFirstChildOfName(child, "a:graphic");
        if (graphic !== undefined) {
            const graphicData = Xml.getFirstChildOfName(graphic, "a:graphicData");
            if (graphicData !== undefined) {
                graphicData.childNodes.forEach(childNode => {
                    if (childNode.nodeName === "pic:pic") {
                        drawing.picture = Picture.fromPicNode(childNode, docx);
                    }
                    if (childNode.nodeName === "c:chart") {
                        const relationship = Xml.getAttribute(childNode, "r:id");
                        if (relationship !== undefined && docx.relationships !== undefined) {
                            const chartTarget = docx.relationships.getTarget(relationship);
                            drawing.chart = this.readChartFromPart(docx.pack.loadPartAsXml(`word/${chartTarget}`));
                        }
                    }
                });
            }
        }
        return drawing;
    }
    static readChartFromPart(promise) {
        const space = new ChartSpace();
        const readingPromise = new Promise((resolve, reject) => {
            promise.then(part => {
                this.readChartFromDocument(part.document, space);
                resolve();
            }).catch(err => {
                reject(err);
            });
        });
        space.setPromise(readingPromise);
        return space;
    }
    static readChartFromDocument(doc, space) {
        const chartSpaceNode = doc.getRootNode().firstChild;
        if (chartSpaceNode !== null) {
            return ChartReader.readChartFromNode(chartSpaceNode, space);
        }
        else {
            console.log('Failed to find chart');
            return new ChartSpace();
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2luZy1yZWFkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZHJhd2luZy9kcmF3aW5nLXJlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN0QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3ZDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUVyRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFFdkQsTUFBTSxPQUFPLGFBQWE7SUFDZixNQUFNLENBQUMsY0FBYyxDQUFDLFdBQXNCLEVBQUUsSUFBZTtRQUNoRSxJQUFJLE1BQU0sR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQy9CLE1BQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEMsSUFBSSxLQUFLLENBQUMsUUFBUSxLQUFLLFdBQVcsRUFBRTtZQUNoQyxNQUFNLEdBQUcsV0FBVyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM5QzthQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsS0FBSyxXQUFXLEVBQUU7WUFDdkMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDOUM7UUFDRCxNQUFNLE9BQU8sR0FBRyxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QyxNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQzVELElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtZQUN2QixNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQ3RFLElBQUksV0FBVyxLQUFLLFNBQVMsRUFBRTtnQkFDM0IsV0FBVyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUU7b0JBQ3ZDLElBQUksU0FBUyxDQUFDLFFBQVEsS0FBSyxTQUFTLEVBQUU7d0JBQ2xDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7cUJBQzFEO29CQUNELElBQUksU0FBUyxDQUFDLFFBQVEsS0FBSyxTQUFTLEVBQUU7d0JBQ2xDLE1BQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO3dCQUN6RCxJQUFJLFlBQVksS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLGFBQWEsS0FBSyxTQUFTLEVBQUU7NEJBQ2hFLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDOzRCQUMvRCxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQzt5QkFDMUY7cUJBQ0o7Z0JBQ0wsQ0FBQyxDQUFDLENBQUE7YUFDTDtTQUNKO1FBQ0QsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUVPLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxPQUF5QjtRQUN0RCxNQUFNLEtBQUssR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO1FBQy9CLE1BQU0sY0FBYyxHQUNoQixJQUFJLE9BQU8sQ0FBTyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUNsQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNoQixJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDakQsT0FBTyxFQUFFLENBQUM7WUFDZCxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ1gsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLENBQUMsQ0FBQyxDQUFBO1FBQ04sQ0FBQyxDQUFDLENBQUM7UUFDUCxLQUFLLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2pDLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFTyxNQUFNLENBQUMscUJBQXFCLENBQUMsR0FBZ0IsRUFBRSxLQUFpQjtRQUNwRSxNQUFNLGNBQWMsR0FBRyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsVUFBVSxDQUFDO1FBQ3BELElBQUksY0FBYyxLQUFLLElBQUksRUFBRTtZQUN6QixPQUFPLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDL0Q7YUFBTTtZQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUNwQyxPQUFPLElBQUksVUFBVSxFQUFFLENBQUM7U0FDM0I7SUFDTCxDQUFDO0NBQ0oifQ==