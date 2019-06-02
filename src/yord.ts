import { SvgRenderer } from "./svg-renderer.js";
import { Package } from "./package.js";
import { WordStyles } from "./word-styles.js";
import { WordDocument } from "./word-document.js";

export class Yord {
    private renderer: SvgRenderer;
    private doc: WordDocument | undefined;

    constructor(element: HTMLElement) {
        this.renderer = new SvgRenderer(element);
    }

    public loadDocxFromUrl(url: string) {
        Package.loadFromUrl(url).then((pack) => {
            pack.loadPart('word/styles.xml').then(stylePart => {
                const styles = new WordStyles(stylePart);
                styles.parseContent();
                pack.loadPart('word/document.xml').then(part => {
                    const doc = new WordDocument(part);
                    doc.parseContent();
                    doc.setNamedStyles(styles);
                    this.doc = doc;
                    this.writeAllText();
                });
            });
        });
    }

    private writeAllText() {
        let posY = 20;
        const doc = this.doc;
        if (doc !== undefined) {
            doc.paragraphs.forEach(par => {
                par.runs.forEach(run => {
                    posY = run.render(this.renderer, posY);
                });
            });
            this.renderer.ensureHeight(posY);
        }
}    
}