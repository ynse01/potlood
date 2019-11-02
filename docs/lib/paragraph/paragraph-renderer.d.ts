import { Paragraph } from "./paragraph.js";
import { VirtualFlow } from "../utils/virtual-flow.js";
import { IPainter } from "../painting/i-painter.js";
export declare class ParagraphRenderer {
    private _textRenderer;
    private _drawingRenderer;
    constructor(painter: IPainter);
    renderParagraph(par: Paragraph, flow: VirtualFlow): void;
}
