import { DocumentX } from '../document-x.js';
export declare class Renderer {
    private _painter;
    private _paragraphRenderer;
    private _tableRenderer;
    constructor(content: HTMLElement);
    renderDocument(docx: DocumentX): number;
    clear(): void;
    ensureHeight(newHeight: number): void;
}
