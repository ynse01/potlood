import { SvgRenderer } from "./svg-renderer.js";
import { Package } from "./package.js";
import { WordStyles } from "./word-styles.js";
import { WordDocument } from "./word-document.js";
import { Style } from "./style.js";

export class Yord {
    private renderer: SvgRenderer;
    private doc: WordDocument | undefined;
    private style: Style;

    constructor(element: HTMLElement) {
        this.renderer = new SvgRenderer(element);
        this.style = new Style();
    }

    public loadDocxFromUrl(url: string) {
        Package.loadFromUrl(url).then((pack) => {
            pack.loadPart('word/styles.xml').then(stylePart => {
                const styles = new WordStyles(stylePart);
                styles.parseContent();
                pack.loadPart('word/document.xml').then(part => {
                    const doc = new WordDocument(part);
                    doc.parseContent();
                    this.doc = doc;
                    this.writeAllText();
                });
            });
        });
    }

    public updateFont(fontFamily: string, fontSize: number): void {
        this.style.updateFont(fontFamily, fontSize);
        this.renderer.clear();
        this.writeAllText();           
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