import { DocumentX } from "../document-x.js";
import { DrawingRun } from "./drawing-run.js";
export declare class DrawingReader {
    static readDrawingRun(drawingNode: ChildNode, docx: DocumentX): DrawingRun;
    private static readChartFromPart;
    private static readChartFromDocument;
}
