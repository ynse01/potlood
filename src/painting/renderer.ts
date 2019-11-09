import { DocumentX } from '../document-x.js';
import { VirtualFlow } from '../utils/virtual-flow.js';
import { Paragraph } from '../paragraph/paragraph.js';
import { SvgPainter } from './svg-painter.js';
import { IPainter } from './i-painter.js';
import { TableRenderer } from '../table/table-renderer.js';
import { ParagraphRenderer } from '../paragraph/paragraph-renderer.js';

export class Renderer {
    private _painter: IPainter;
    private _paragraphRenderer: ParagraphRenderer;
    private _tableRenderer: TableRenderer;

    constructor(content: HTMLElement) {
        this._painter = new SvgPainter(content);
        this._paragraphRenderer = new ParagraphRenderer(this._painter);
        this._tableRenderer = new TableRenderer(this._painter, this._paragraphRenderer);
    }

    public renderDocument(docx: DocumentX): number {
        const flow = VirtualFlow.fromSection(docx.section);
        docx.paragraphs.forEach(parOrTable => {
            parOrTable.performLayout(flow);
        });
        const height = flow.getY();
        flow.advancePosition(height);
        docx.paragraphs.forEach(parOrTable => {
            if (parOrTable instanceof Paragraph) {
                this._paragraphRenderer.renderParagraph(parOrTable, flow);
            } else {
                this._tableRenderer.renderTable(parOrTable, flow);
            }
        });
        return height;
    }

    public clear() {
        this._painter.clear();
    }

    public ensureHeight(newHeight: number): void {
        this._painter.ensureHeight(newHeight);
    }
}
