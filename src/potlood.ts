import { Renderer } from "./painting/renderer.js";
import { Package } from "./package/package.js";
import { NamedStyles } from "./text/named-styles.js";
import { DocumentX } from "./document-x.js";
import { AbstractNumberings } from "./numbering/abstract-numberings.js";
import { Relationships } from "./package/relationships.js";
import { Metrics } from "./utils/metrics.js";

export class Potlood {
    private renderer: Renderer;

    constructor(element: HTMLElement) {
        this.renderer = new Renderer(element);
    }

    public loadDocxFromUrl(url: string): void {
        Metrics.init();
        this.renderer.clear();
        Package.loadFromUrl(url).then((pack) => {
            this._loadFromPackage(pack);
        });
    }

    public loadDocxFromFiles(files: FileList): void {
        Metrics.init();
        this.renderer.clear();
        Package.loadFromFile(files).then((pack) => {
            this._loadFromPackage(pack);
        });
    }

    private _loadFromPackage(pack: Package): void {
        pack.loadPart('word/_rels/document.xml.rels').then(relPart => {
            const relationships = Relationships.fromDocument(relPart.document);
            pack.loadPart('word/styles.xml').then(stylePart => {
                const styles = new NamedStyles(stylePart);
                styles.parseContent();
                pack.loadPart('word/numbering.xml').then(numPart => {
                    const numberings = new AbstractNumberings(numPart);
                    numberings.parseContent(styles);
                    pack.loadPart('word/document.xml').then(part => {
                        const docx = new DocumentX(pack, part);
                        docx.setRelationships(relationships);
                        docx.setNamedStyles(styles);
                        docx.setNumberings(numberings);
                        docx.parseContent();
                        const posY = this.renderer.renderDocument(docx);
                        this.renderer.ensureHeight(posY);
                    });
                });
            });
        });
    }
}