import { SvgRenderer } from "./painting/svg-renderer.js";
import { Package } from "./package/package.js";
import { NamedStyles } from "./text/named-styles.js";
import { WordDocument } from "./word-document.js";
import { AbstractNumberings } from "./numbering/abstract-numberings.js";
import { Relationships } from "./package/relationships.js";
import { Metrics } from "./metrics.js";

export class Yord {
    private renderer: SvgRenderer;

    constructor(element: HTMLElement) {
        this.renderer = new SvgRenderer(element);
        Metrics.init();
    }

    public loadDocxFromUrl(url: string) {
        Package.loadFromUrl(url).then((pack) => {
            pack.loadPart('word/_rels/document.xml.rels').then(relPart => {
                const relationships = Relationships.fromDocument(relPart.document);
                pack.loadPart('word/styles.xml').then(stylePart => {
                    const styles = new NamedStyles(stylePart);
                    styles.parseContent();
                    pack.loadPart('word/numbering.xml').then(numPart => {
                        const numberings = new AbstractNumberings(numPart);
                        numberings.parseContent(styles);
                        pack.loadPart('word/document.xml').then(part => {
                            const doc = new WordDocument(pack, part);
                            doc.setRelationships(relationships);
                            doc.setNamedStyles(styles);
                            doc.setNumberings(numberings);
                            doc.parseContent();
                            const posY = this.renderer.renderDocument(doc);
                            this.renderer.ensureHeight(posY);
                        });
                    });
                });
            });
        });
    }
}