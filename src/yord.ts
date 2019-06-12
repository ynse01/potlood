import { SvgRenderer } from "./svg-renderer.js";
import { Package } from "./package.js";
import { WordStyles } from "./word-styles.js";
import { WordDocument } from "./word-document.js";
import { WordNumberings } from "./word-numberings.js";

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
                pack.loadPart('word/numbering.xml').then(numPart => {
                    const numberings = new WordNumberings(numPart);
                    numberings.parseContent(styles);
                    pack.loadPart('word/document.xml').then(part => {
                        const doc = new WordDocument(part);
                        doc.setNamedStyles(styles);
                        doc.setNumberings(numberings);
                        doc.parseContent();
                        this.doc = doc;
                        this.writeAllText();
                    });
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