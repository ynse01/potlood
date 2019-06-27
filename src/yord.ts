import { SvgRenderer } from "./svg-renderer.js";
import { Package } from "./package.js";
import { NamedStyles } from "./named-styles.js";
import { WordDocument } from "./word-document.js";
import { AbstractNumberings } from "./abstract-numberings.js";

export class Yord {
    private renderer: SvgRenderer;
    private doc: WordDocument | undefined;

    constructor(element: HTMLElement) {
        this.renderer = new SvgRenderer(element);
    }

    public loadDocxFromUrl(url: string) {
        Package.loadFromUrl(url).then((pack) => {
            pack.loadPart('word/styles.xml').then(stylePart => {
                const styles = new NamedStyles(stylePart);
                styles.parseContent();
                pack.loadPart('word/numbering.xml').then(numPart => {
                    const numberings = new AbstractNumberings(numPart);
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
        if (this.doc !== undefined) {
            const posY = this.renderer.renderDocument(this.doc);
            this.renderer.ensureHeight(posY);
        }
    }    
}